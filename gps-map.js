const gpsMapPayloadStorageKey = "archaeolab-gps-map-payload-v1";

let mapInstance = null;
let markerLayer = null;
let routeLayer = null;
let activePoints = [];

document.addEventListener("DOMContentLoaded", initializeGpsMapPage);

function initializeGpsMapPage() {
    const closeButton = document.getElementById("closeMapButton");
    const connectToggle = document.getElementById("connectPointsToggle");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            window.close();
            // If this tab was not opened by script, close() is ignored.
            if (!window.closed) {
                window.location.href = "./index.html";
            }
        });
    }

    if (connectToggle) {
        connectToggle.addEventListener("change", function () {
            renderMapLayers();
        });
    }

    const payload = loadGpsMapPayload();

    if (!payload) {
        setStatus("No GPS map payload was found. Open this page from the app after saving STPs.", true);
        renderTypeLegend();
        renderPointList([]);
        return;
    }

    const titleText = toText(payload.title) || "GPS Points Map";
    document.title = titleText;

    const titleElement = document.getElementById("gpsMapTitle");
    if (titleElement) {
        titleElement.textContent = titleText;
    }

    const rawPoints = Array.isArray(payload.points) ? payload.points : [];

    activePoints = rawPoints.map(function (point, index) {
        const latitude = Number(point && point.latitude);
        const longitude = Number(point && point.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
        }

        const typeKey = normalizeTypeKey(point && (point.entryTypeKey || point.entryTypeLabel || point.entryType));
        const typeLabel = toText(point && point.entryTypeLabel) || getTypeStyle(typeKey).label;

        return {
            label: toText(point && point.label) || ("Point " + (index + 1)),
            entryTypeKey: typeKey,
            entryTypeLabel: typeLabel,
            latitude: latitude,
            longitude: longitude,
            savedAt: toText(point && point.savedAt)
        };
    }).filter(Boolean);

    renderTypeLegend();
    renderPointList(activePoints);

    if (activePoints.length === 0) {
        setStatus("No valid GPS points found in the payload.", true);
        return;
    }

    renderMapLayers();
}

function loadGpsMapPayload() {
    let rawValue = "";

    try {
        rawValue = sessionStorage.getItem(gpsMapPayloadStorageKey) || "";
    } catch (_error) {
        rawValue = "";
    }

    if (!rawValue) {
        try {
            rawValue = localStorage.getItem(gpsMapPayloadStorageKey) || "";
        } catch (_error) {
            rawValue = "";
        }
    }

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch (_error) {
        return null;
    }
}

function toText(value) {
    return String(value == null ? "" : value);
}

function escapeHtml(value) {
    return toText(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatSavedAt(value) {
    if (!value) {
        return "";
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleString();
}

function normalizeTypeKey(value) {
    const key = toText(value).toLowerCase().trim();

    if (key === "supplemental" || key === "unit-id" || key === "base") {
        return key;
    }

    if (key.includes("supplemental")) {
        return "supplemental";
    }

    if (key.includes("unit")) {
        return "unit-id";
    }

    return "base";
}

function getTypeStyle(typeKey) {
    if (typeKey === "supplemental") {
        return {
            fill: "#f4b63e",
            stroke: "#8f6000",
            label: "Supplemental STP"
        };
    }

    if (typeKey === "unit-id") {
        return {
            fill: "#2d8f84",
            stroke: "#14554f",
            label: "Unit ID"
        };
    }

    return {
        fill: "#b21e1e",
        stroke: "#5f0f0f",
        label: "Base STP"
    };
}

function setStatus(text, isError) {
    const statusElement = document.getElementById("gpsMapStatus");

    if (!statusElement) {
        return;
    }

    statusElement.textContent = text || "";
    statusElement.className = isError ? "status error" : "status";
}

function renderTypeLegend() {
    const legend = document.getElementById("gpsTypeLegend");

    if (!legend) {
        return;
    }

    legend.innerHTML = "";

    ["base", "supplemental", "unit-id"].forEach(function (typeKey) {
        const style = getTypeStyle(typeKey);
        const item = document.createElement("span");
        const dot = document.createElement("span");
        const text = document.createElement("span");

        item.className = "legend-item";
        dot.className = "legend-dot";
        dot.style.backgroundColor = style.fill;
        dot.style.borderColor = style.stroke;
        text.textContent = style.label;

        item.appendChild(dot);
        item.appendChild(text);
        legend.appendChild(item);
    });
}

function renderPointList(points) {
    const list = document.getElementById("gpsPointList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    points.forEach(function (point, index) {
        const item = document.createElement("li");
        const label = point.label || ("Point " + (index + 1));
        const typeLabel = point.entryTypeLabel || getTypeStyle(point.entryTypeKey).label;

        item.textContent = label + " | " + typeLabel + " | "
            + point.latitude.toFixed(6) + ", " + point.longitude.toFixed(6);

        list.appendChild(item);
    });
}

function ensureMap() {
    if (typeof window.L === "undefined") {
        setStatus("Map tiles could not load. Check internet connection. Coordinates are listed below.", true);
        return false;
    }

    if (!mapInstance) {
        mapInstance = window.L.map("gpsMapCanvas", { zoomControl: true });

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(mapInstance);

        markerLayer = window.L.layerGroup().addTo(mapInstance);
        routeLayer = window.L.layerGroup().addTo(mapInstance);
    }

    return true;
}

function renderMapLayers() {
    if (!ensureMap()) {
        return;
    }

    markerLayer.clearLayers();
    routeLayer.clearLayers();

    const bounds = [];
    const lineCoordinates = [];

    activePoints.forEach(function (point, index) {
        const typeStyle = getTypeStyle(point.entryTypeKey);
        const typeLabel = point.entryTypeLabel || typeStyle.label;

        const marker = window.L.circleMarker([point.latitude, point.longitude], {
            radius: 8,
            color: typeStyle.stroke,
            weight: 2,
            fillColor: typeStyle.fill,
            fillOpacity: 0.93
        }).addTo(markerLayer);

        const popupHtml = "<strong>" + escapeHtml(point.label || ("Point " + (index + 1))) + "</strong><br>"
            + "<span>" + escapeHtml(typeLabel) + "</span><br>"
            + "<span>" + point.latitude.toFixed(6) + ", " + point.longitude.toFixed(6) + "</span>"
            + (point.savedAt ? "<br><span>Saved " + escapeHtml(formatSavedAt(point.savedAt)) + "</span>" : "");

        marker.bindPopup(popupHtml);
        bounds.push([point.latitude, point.longitude]);
        lineCoordinates.push([point.latitude, point.longitude]);
    });

    const connectToggle = document.getElementById("connectPointsToggle");
    const connectEnabled = Boolean(connectToggle && connectToggle.checked);

    if (connectEnabled && lineCoordinates.length > 1) {
        window.L.polyline(lineCoordinates, {
            color: "#243f3a",
            weight: 3,
            opacity: 0.75,
            dashArray: "8 6"
        }).addTo(routeLayer);
    }

    if (bounds.length === 1) {
        mapInstance.setView(bounds[0], 17);
    } else if (bounds.length > 1) {
        mapInstance.fitBounds(bounds, { padding: [28, 28] });
    }

    setTimeout(function () {
        if (mapInstance) {
            mapInstance.invalidateSize();
        }
    }, 120);

    const pointSummary = activePoints.length + (activePoints.length === 1 ? " GPS point plotted." : " GPS points plotted.");
    const pathSummary = connectEnabled ? " Connected path on." : " Connected path off.";
    setStatus(pointSummary + pathSummary, false);
}
