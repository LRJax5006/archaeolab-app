const storageKey = "archaeolab-stp-session-v1";
const projectsStorageKey = "archaeolab-projects-v1";
const maxProjectImageSizeBytes = 3 * 1024 * 1024;
const supportedProjectImageTypes = ["image/jpeg", "image/png", "image/webp"];
const supportedProjectImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const photoDatabaseName = "archaeolab-stp-photos-v1";
const photoDatabaseStore = "photos";
const photoDatabaseVersion = 1;
const draftPhotoBlobs = new Map();

let photoDatabasePromise;

const dropdownOptions = {
    munsell: [
        "10YR2/1",
        "10YR2/2",
        "10YR3/1",
        "10YR3/2",
        "10YR3/3",
        "10YR3/4",
        "10YR3/6",
        "10YR4/1",
        "10YR4/2",
        "10YR4/3",
        "10YR4/6",
        "10YR5/1",
        "10YR5/2",
        "10YR5/3",
        "10YR5/4",
        "10YR5/6",
        "10YR5/8",
        "10YR6/1",
        "10YR6/2",
        "10YR6/3",
        "10YR6/4",
        "10YR6/6",
        "10YR6/8",
        "10YR7/1",
        "10YR7/2",
        "10YR7/3",
        "10YR7/4",
        "10YR7/6",
        "10YR7/8",
        "10YR8/1",
        "10YR8/2",
        "10YR8/3",
        "10YR8/4",
        "10YR8/6",
        "10YR8/8",
        "2.5Y2.5/1",
        "2.5Y3/1",
        "2.5Y3/2",
        "2.5Y3/3",
        "2.5Y4/1",
        "2.5Y4/2",
        "2.5Y4/3",
        "2.5Y4/4",
        "2.5YR5/1",
        "2.5YR5/2",
        "2.5YR5/3",
        "2.5YR5/4",
        "2.5YR5/6",
        "2.5YR6/1",
        "2.5YR6/2",
        "2.5YR6/3",
        "2.5YR6/4",
        "2.5YR6/6",
        "2.5YR6/8",
        "2.5YR7/1",
        "2.5YR7/2",
        "2.5YR7/3",
        "2.5YR7/4",
        "2.5YR7/6",
        "2.5YR7/8",
        "2.5YR8/1",
        "2.5YR8/2",
        "2.5YR8/3",
        "2.5YR8/4",
        "2.5YR8/6",
        "2.5YR8/8",
        "5YR2.5/1",
        "5YR2.5/2",
        "5YR3/1",
        "5YR3/2",
        "5YR3/3",
        "5YR3/4",
        "5YR3/6",
        "5YR3/8",
        "5YR4/1",
        "5YR4/2",
        "5YR4/3",
        "5YR4/4",
        "5YR4/6",
        "5YR5/1",
        "5YR5/2",
        "5YR5/3",
        "5YR5/4",
        "5YR5/6",
        "5YR5/8",
        "5YR6/1",
        "5YR6/2",
        "5YR6/3",
        "5YR6/4",
        "5YR6/6",
        "5YR6/8",
        "5YR7/1",
        "5YR7/2",
        "5YR7/3",
        "5YR7/4",
        "5YR7/6",
        "5YR7/8",
        "5YR8/1",
        "5YR8/2",
        "5YR8/3",
        "5YR8/4",
        "7.5YR2.5/1",
        "7.5YR2.5/2",
        "7.5YR3/1",
        "7.5YR3/2",
        "7.5YR3/3",
        "7.5YR3/4",
        "7.5YR4/1",
        "7.5YR4/2",
        "7.5YR4/3",
        "7.5YR4/4",
        "7.5YR4/6",
        "7.5YR5/1",
        "7.5YR5/2",
        "7.5YR5/3",
        "7.5YR5/4",
        "7.5YR5/6",
        "7.5YR5/8",
        "7.5YR6/1",
        "7.5YR6/2",
        "7.5YR6/3",
        "7.5YR6/4",
        "7.5YR6/6",
        "7.5YR6/8",
        "7.5YR7/1",
        "7.5YR7/2",
        "7.5YR7/3",
        "7.5YR7/4",
        "7.5YR7/6",
        "7.5YR7/8",
        "7.5YR8/1",
        "7.5YR8/2",
        "7.5YR8/3",
        "7.5YR8/4",
        "Gleyed",
        "Mixed",
        "Mottled",
        "Null",
        "Redox"
    ],
    texture: [
        "Ash",
        "Clay",
        "Clay & sand",
        "Clay loam",
        "Clay silt",
        "Clayey sand loam",
        "Clayey sandy silt",
        "Clayey sandy silt loam",
        "Clayey silt loam",
        "Const Debris",
        "Driveway",
        "Fine loamy sand",
        "Fine sandy clay",
        "Fine sandy clay loam",
        "Fine sandy loam",
        "Fine sandy silt loam",
        "Fine silt",
        "Gravel",
        "Gravelly clay loam",
        "Gravelly loamy sand",
        "Gravelly sand",
        "Gravelly sand loam",
        "Gravelly sandy silt loam",
        "Gravelly silt",
        "Gravelly silt loam",
        "Humus",
        "Impenetrable",
        "Loam",
        "Loamy sand",
        "Overgrowth",
        "Redox",
        "Road Cut",
        "Rubble",
        "Sand",
        "Sandy clay",
        "Sandy clay loam",
        "Sandy loam",
        "Sandy silt",
        "Sandy silt loam",
        "Sandy Silty Clay",
        "Silt",
        "Silt loam",
        "Silty Clay Sand",
        "Silty Loam Sand",
        "Silty Sand",
        "Silty sandy loam",
        "Silty clay",
        "Silty clay loam",
        "Very fine sand",
        "Very fine sandy clay",
        "Very fine sandy clay loam",
        "Very fine sandy loam",
        "Very fine sandy silt",
        "Very fine sandy silt loam",
        "Very fine silt",
        "Very fine silt loam"
    ],
    horizon: [
        "A",
        "A1",
        "A2",
        "A3",
        "A4",
        "Ao",
        "Ao1",
        "Ao2",
        "Ao3",
        "Ap",
        "Ap1",
        "Ap2",
        "Ap3",
        "B",
        "BA",
        "BE",
        "Bt",
        "Bt1",
        "Bt2",
        "Bt3",
        "Bt4",
        "Bw",
        "Bw1",
        "Bw2",
        "Bw3",
        "Bw4",
        "C",
        "C1",
        "C2",
        "C3",
        "C4",
        "E"
    ]
};

const state = {
    siteName: "",
    siteLocation: "",
    depthUnit: "metric",
    stps: [],
    projectImage: ""
};

const elements = {};

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    cacheElements();
    populateDropdownDatalists();
    bindEvents();
    loadSession();
    populateSiteFields();
    refreshParentStpOptions();
    updateStpTypeUi();
    renderSavedStps();
    renderProjects();
    renderProjectBanner();
    resetCurrentStp(false);
}

function cacheElements() {
    elements.entryForm = document.getElementById("entryForm");
    elements.siteName = document.getElementById("siteName");
    elements.siteLocation = document.getElementById("siteLocation");
    elements.depthUnit = document.getElementById("depthUnit");
    elements.stpEntryType = document.getElementById("stpEntryType");
    elements.parentStp = document.getElementById("parentStp");
    elements.gpsLatitude = document.getElementById("gpsLatitude");
    elements.gpsLongitude = document.getElementById("gpsLongitude");
    elements.stpLabel = document.getElementById("stpLabel");
    elements.supDirection = document.getElementById("supDirection");
    elements.strataList = document.getElementById("strataList");
    elements.stratumTemplate = document.getElementById("stratumTemplate");
    elements.sessionStatus = document.getElementById("sessionStatus");
    elements.savedEmptyState = document.getElementById("savedEmptyState");
    elements.savedStpList = document.getElementById("savedStpList");
    elements.addStratumButton = document.getElementById("addStratumButton");
    elements.saveStpButton = document.getElementById("saveStpButton");
    elements.resetCurrentButton = document.getElementById("resetCurrentButton");
    elements.exportXlsxButton = document.getElementById("exportXlsxButton");
    elements.exportCsvButton = document.getElementById("exportCsvButton");
    elements.exportJsonButton = document.getElementById("exportJsonButton");
    elements.clearSessionButton = document.getElementById("clearSessionButton");
    elements.suggestLabelButton = document.getElementById("suggestLabelButton");
    elements.saveProjectButton = document.getElementById("saveProjectButton");
    elements.projectsEmptyState = document.getElementById("projectsEmptyState");
    elements.projectsList = document.getElementById("projectsList");
    elements.projectBannerImg = document.getElementById("projectBannerImg");
    elements.projectBannerEmpty = document.getElementById("projectBannerEmpty");
    elements.projectImageInput = document.getElementById("projectImageInput");
    elements.removeProjectImageButton = document.getElementById("removeProjectImageButton");
    elements.projectImageMessage = document.getElementById("projectImageMessage");
    elements.mapViewerModal = document.getElementById("mapViewerModal");
    elements.mapViewerImage = document.getElementById("mapViewerImage");
    elements.closeMapViewerButton = document.getElementById("closeMapViewerButton");
}

function bindEvents() {
    elements.addStratumButton.addEventListener("click", function () {
        addStratumCard();
    });

    elements.saveStpButton.addEventListener("click", saveCurrentStp);
    elements.resetCurrentButton.addEventListener("click", function () {
        resetCurrentStp(true);
    });
    elements.exportXlsxButton.addEventListener("click", downloadExcelReadyXlsx);
    elements.exportCsvButton.addEventListener("click", downloadExcelReadyCsv);
    elements.exportJsonButton.addEventListener("click", downloadSessionData);
    elements.clearSessionButton.addEventListener("click", clearSession);
    elements.suggestLabelButton.addEventListener("click", suggestFromCurrentInput);
    elements.saveProjectButton.addEventListener("click", saveProjectAndStartNew);
    elements.projectImageInput.addEventListener("change", handleProjectImageUpload);
    elements.removeProjectImageButton.addEventListener("click", removeProjectImage);
    elements.projectBannerImg.addEventListener("click", openMapViewer);
    elements.projectBannerImg.addEventListener("keydown", handleProjectBannerKeyDown);
    elements.closeMapViewerButton.addEventListener("click", closeMapViewer);
    elements.mapViewerModal.addEventListener("click", handleMapViewerClick);
    document.addEventListener("keydown", handleMapViewerEscape);

    elements.siteName.addEventListener("input", updateSiteDraft);
    elements.siteLocation.addEventListener("input", updateSiteDraft);
    elements.depthUnit.addEventListener("change", updateSiteDraft);

    elements.stpEntryType.addEventListener("change", function () {
        updateStpTypeUi();
        refreshPhotoRulesAll();
    });

    elements.parentStp.addEventListener("change", function () {
        refreshPhotoRulesAll();
    });

    elements.stpLabel.addEventListener("input", function () {
        refreshPhotoRulesAll();
    });

    elements.supDirection.addEventListener("change", function () {
        refreshPhotoRulesAll();
    });

    elements.strataList.addEventListener("click", handleStrataListClick);
    elements.strataList.addEventListener("input", handleStrataListInput);
    elements.strataList.addEventListener("change", handleStrataListChange);
}

function populateDropdownDatalists() {
    populateDatalist("munsellOptions", dropdownOptions.munsell);
    populateDatalist("textureOptions", dropdownOptions.texture);
    populateDatalist("horizonOptions", dropdownOptions.horizon);
}

function populateDatalist(datalistId, values) {
    const datalist = document.getElementById(datalistId);

    if (!datalist) {
        return;
    }

    datalist.innerHTML = "";

    values.forEach(function (value) {
        const option = document.createElement("option");
        option.value = value;
        datalist.appendChild(option);
    });
}

function loadSession() {
    const rawSession = localStorage.getItem(storageKey);

    if (!rawSession) {
        return;
    }

    try {
        const savedSession = JSON.parse(rawSession);

        state.siteName = savedSession.siteName || "";
        state.siteLocation = savedSession.siteLocation || "";
        state.depthUnit = savedSession.depthUnit || "metric";
        state.stps = Array.isArray(savedSession.stps) ? savedSession.stps : [];
        state.projectImage = savedSession.projectImage || "";
    } catch (error) {
        console.warn("Could not load saved session.", error);
    }
}

function saveSession() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        return true;
    } catch (error) {
        console.warn("Could not save session.", error);
        return false;
    }
}

function populateSiteFields() {
    elements.siteName.value = state.siteName;
    elements.siteLocation.value = state.siteLocation;
    elements.depthUnit.value = state.depthUnit;
    applyDepthUnitUi();
}

function updateSiteDraft() {
    state.siteName = elements.siteName.value.trim();
    state.siteLocation = elements.siteLocation.value.trim();
    state.depthUnit = elements.depthUnit.value;
    applyDepthUnitUi();
    refreshPhotoRulesAll();
    saveSession();
}

function addStratumCard(defaults) {
    const template = elements.stratumTemplate.content.cloneNode(true);
    const card = template.querySelector(".stratum-card");

    elements.strataList.prepend(card);

    const newCard = elements.strataList.firstElementChild;
    const fields = newCard.querySelectorAll("[data-field]");

    fields.forEach(function (field) {
        const fieldName = field.getAttribute("data-field");

        if (field.type === "file" || fieldName === "photoRule") {
            return;
        }

        if (defaults && Object.prototype.hasOwnProperty.call(defaults, fieldName)) {
            field.value = defaults[fieldName];
        }
    });

    if (defaults && Array.isArray(defaults.photos)) {
        setCardPhotoEntries(newCard, defaults.photos);
    } else if (defaults && Array.isArray(defaults.photoNames)) {
        setCardPhotoNames(newCard, defaults.photoNames);
    } else {
        setCardPhotoEntries(newCard, []);
    }

    renumberStrata();
    applyDepthUnitUi();
    updatePhotoRuleForCard(newCard);
}

function renumberStrata() {
    const cards = elements.strataList.querySelectorAll(".stratum-card");

    cards.forEach(function (card, index) {
        const rowNumber = cards.length - index;
        const rowLabel = card.querySelector("[data-row-number]");
        const stratumField = card.querySelector('[data-field="stratumLabel"]');

        if (rowLabel) {
            rowLabel.textContent = rowNumber;
        }

        if (stratumField) {
            stratumField.value = rowNumber;
        }
    });

    refreshPhotoRulesAll();
}

function handleStrataListClick(event) {
    const removePhotoButton = event.target.closest("[data-photo-remove]");

    if (removePhotoButton) {
        const card = removePhotoButton.closest(".stratum-card");

        if (!card) {
            return;
        }

        const removeIndex = Number(removePhotoButton.getAttribute("data-photo-remove"));
        const entries = getCardPhotoEntries(card);

        if (Number.isNaN(removeIndex) || removeIndex < 0 || removeIndex >= entries.length) {
            return;
        }

        const removedEntries = entries.splice(removeIndex, 1);
        removedEntries.forEach(releaseDraftPhotoEntry);

        setCardPhotoEntries(card, entries);
        validatePhotoNamesForCard(card);
        renderPhotoListForCard(card);
        return;
    }

    const removeButton = event.target.closest("[data-remove-stratum]");

    if (!removeButton) {
        return;
    }

    const card = removeButton.closest(".stratum-card");

    if (!card) {
        return;
    }

    if (elements.strataList.children.length === 1) {
        alert("Keep at least one stratum card for the current STP.");
        return;
    }

    releaseCardDraftPhotos(card);

    card.remove();
    renumberStrata();
}

function handleStrataListInput(event) {
    const field = event.target;

    if (!field) {
        return;
    }

    if (field.matches("[data-photo-name-input]")) {
        const card = field.closest(".stratum-card");

        if (!card) {
            return;
        }

        const photoIndex = Number(field.getAttribute("data-photo-index"));
        const entries = getCardPhotoEntries(card);

        if (Number.isNaN(photoIndex) || photoIndex < 0 || photoIndex >= entries.length) {
            return;
        }

        entries[photoIndex].name = field.value;
        setCardPhotoEntries(card, entries);
        validatePhotoNamesForCard(card);

        const warningElement = card.querySelector("[data-photo-warning]");
        if (warningElement) {
            warningElement.textContent = card.dataset.photoWarning || "";
        }

        return;
    }

    if (!field || !field.matches("[data-field]")) {
        return;
    }

    const fieldName = field.getAttribute("data-field");

    if (fieldName === "stratumLabel") {
        const card = field.closest(".stratum-card");
        updatePhotoRuleForCard(card);
    }
}

function handleStrataListChange(event) {
    const field = event.target;

    if (!field) {
        return;
    }

    if (field.matches("[data-photo-name-input]")) {
        const card = field.closest(".stratum-card");

        if (!card) {
            return;
        }

        const photoIndex = Number(field.getAttribute("data-photo-index"));
        const entries = getCardPhotoEntries(card);

        if (Number.isNaN(photoIndex) || photoIndex < 0 || photoIndex >= entries.length) {
            return;
        }

        entries[photoIndex].name = field.value.trim();
        setCardPhotoEntries(card, entries);
        validatePhotoNamesForCard(card);
        renderPhotoListForCard(card);
        return;
    }

    if (!field || !field.matches("[data-field]")) {
        return;
    }

    const fieldName = field.getAttribute("data-field");

    if (fieldName !== "photos") {
        return;
    }

    const card = field.closest(".stratum-card");

    if (!card) {
        return;
    }

    const selectedFiles = Array.from(field.files || []);

    if (selectedFiles.length === 0) {
        return;
    }

    const existingEntries = getCardPhotoEntries(card);
    const stratumLabelField = card.querySelector('[data-field="stratumLabel"]');
    const prefix = card.dataset.photoPrefix || buildPhotoPrefix(stratumLabelField ? stratumLabelField.value : "1");
    const photoEntries = selectedFiles.map(function (file, index) {
        const draftId = createPhotoDraftId();
        draftPhotoBlobs.set(draftId, file);

        return {
            pendingId: draftId,
            name: buildAutoPhotoName(prefix, existingEntries.length + index + 1, file.name),
            type: file.type || "",
            size: file.size || 0,
            originalName: file.name || ""
        };
    });

    setCardPhotoEntries(card, existingEntries.concat(photoEntries));
    validatePhotoNamesForCard(card);
    renderPhotoListForCard(card);
    field.value = "";
}

function sanitizeToken(value) {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getFileExtension(fileName) {
    const match = /\.([A-Za-z0-9]+)$/.exec(String(fileName || ""));

    if (!match) {
        return ".jpg";
    }

    return "." + match[1].toLowerCase();
}

function buildAutoPhotoName(prefix, sequence, fileName) {
    const safeSequence = Number.isFinite(sequence) ? Math.max(1, sequence) : 1;
    const numberToken = String(safeSequence).padStart(2, "0");
    return prefix + "_" + numberToken + getFileExtension(fileName);
}

function getDisplayStpLabelFromForm() {
    const label = elements.stpLabel.value.trim();
    const isSupplemental = elements.stpEntryType.value === "supplemental";
    const supDirection = elements.supDirection.value;

    if (!label) {
        return "STP";
    }

    if (isSupplemental && supDirection) {
        return label + supDirection;
    }

    return label;
}

function buildPhotoPrefix(stratumLabel) {
    const siteToken = sanitizeToken(elements.siteName.value) || "SITE";
    const stpToken = sanitizeToken(getDisplayStpLabelFromForm()) || "STP";
    const stratumToken = sanitizeToken(stratumLabel || "1") || "1";

    return siteToken + "_" + stpToken + "_STR" + stratumToken;
}

function updatePhotoRuleForCard(card) {
    if (!card) {
        return;
    }

    const stratumLabelField = card.querySelector('[data-field="stratumLabel"]');
    const photoRuleField = card.querySelector('[data-field="photoRule"]');

    if (!stratumLabelField || !photoRuleField) {
        return;
    }

    const previousPrefix = card.dataset.photoPrefix || "";
    const prefix = buildPhotoPrefix(stratumLabelField.value || "1");
    card.dataset.photoPrefix = prefix;
    photoRuleField.value = prefix + "_01.jpg";

    const existingEntries = getCardPhotoEntries(card);
    if (existingEntries.length > 0 && previousPrefix && previousPrefix !== prefix) {
        const renamedEntries = existingEntries.map(function (entry, index) {
            return normalizePhotoEntry({
                id: entry.id,
                pendingId: entry.pendingId,
                name: buildAutoPhotoName(prefix, index + 1, entry.name),
                type: entry.type,
                size: entry.size,
                originalName: entry.originalName
            });
        });

        setCardPhotoEntries(card, renamedEntries);
    }

    validatePhotoNamesForCard(card);
    renderPhotoListForCard(card);
}

function refreshPhotoRulesAll() {
    elements.strataList.querySelectorAll(".stratum-card").forEach(function (card) {
        updatePhotoRuleForCard(card);
    });
}

function createPhotoDraftId() {
    return "draft-" + String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

function createPhotoRecordId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return "photo-" + String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

function getPhotoDatabase() {
    if (!("indexedDB" in window)) {
        return Promise.reject(new Error("IndexedDB is not supported in this browser."));
    }

    if (!photoDatabasePromise) {
        photoDatabasePromise = new Promise(function (resolve, reject) {
            const request = window.indexedDB.open(photoDatabaseName, photoDatabaseVersion);

            request.onupgradeneeded = function () {
                const database = request.result;

                if (!database.objectStoreNames.contains(photoDatabaseStore)) {
                    database.createObjectStore(photoDatabaseStore, { keyPath: "id" });
                }
            };

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error || new Error("Could not open photo storage."));
            };
        });
    }

    return photoDatabasePromise;
}

async function savePhotoBlobToDatabase(photoId, blobValue) {
    const database = await getPhotoDatabase();

    return new Promise(function (resolve, reject) {
        const transaction = database.transaction(photoDatabaseStore, "readwrite");
        const store = transaction.objectStore(photoDatabaseStore);

        store.put({
            id: photoId,
            blob: blobValue,
            savedAt: new Date().toISOString()
        });

        transaction.oncomplete = function () {
            resolve();
        };

        transaction.onerror = function () {
            reject(transaction.error || new Error("Could not save photo blob."));
        };

        transaction.onabort = function () {
            reject(transaction.error || new Error("Photo save was aborted."));
        };
    });
}

async function deletePhotoBlobFromDatabase(photoId) {
    if (!photoId || !("indexedDB" in window)) {
        return;
    }

    const database = await getPhotoDatabase();

    return new Promise(function (resolve, reject) {
        const transaction = database.transaction(photoDatabaseStore, "readwrite");
        const store = transaction.objectStore(photoDatabaseStore);

        store.delete(photoId);

        transaction.oncomplete = function () {
            resolve();
        };

        transaction.onerror = function () {
            reject(transaction.error || new Error("Could not delete photo blob."));
        };

        transaction.onabort = function () {
            reject(transaction.error || new Error("Photo delete was aborted."));
        };
    });
}

async function deletePhotoBlobsFromDatabase(photoIds) {
    const uniqueIds = Array.from(new Set((photoIds || []).filter(Boolean)));

    for (const photoId of uniqueIds) {
        await deletePhotoBlobFromDatabase(photoId);
    }
}

function normalizePhotoEntry(entry) {
    return {
        id: entry && entry.id ? String(entry.id) : "",
        pendingId: entry && entry.pendingId ? String(entry.pendingId) : "",
        name: String(entry && entry.name != null ? entry.name : ""),
        type: entry && entry.type ? String(entry.type) : "",
        size: Number.isFinite(Number(entry && entry.size)) ? Number(entry.size) : 0,
        originalName: entry && entry.originalName ? String(entry.originalName) : ""
    };
}

function getCardPhotoEntries(card) {
    const rawEntries = card.dataset.photoEntries;

    if (rawEntries) {
        try {
            const parsed = JSON.parse(rawEntries);
            if (Array.isArray(parsed)) {
                return parsed.map(normalizePhotoEntry);
            }
        } catch (error) {
            return [];
        }
    }

    const rawNames = card.dataset.photoNames;

    if (!rawNames) {
        return [];
    }

    try {
        const parsedNames = JSON.parse(rawNames);
        if (!Array.isArray(parsedNames)) {
            return [];
        }

        return parsedNames.map(function (name) {
            return normalizePhotoEntry({ name: name });
        });
    } catch (error) {
        return [];
    }
}

function setCardPhotoEntries(card, entries) {
    const safeEntries = Array.isArray(entries)
        ? entries.map(normalizePhotoEntry)
        : [];

    card.dataset.photoEntries = JSON.stringify(safeEntries);
    card.dataset.photoNames = JSON.stringify(safeEntries.map(function (entry) {
        return entry.name;
    }));
}

function getCardPhotoNames(card) {
    return getCardPhotoEntries(card).map(function (entry) {
        return entry.name;
    });
}

function setCardPhotoNames(card, names) {
    const safeNames = Array.isArray(names)
        ? names.map(function (name) {
            return String(name == null ? "" : name);
        })
        : [];

    const existingEntries = getCardPhotoEntries(card);
    const nextEntries = safeNames.map(function (name, index) {
        const existing = existingEntries[index] || {};

        return normalizePhotoEntry({
            id: existing.id || "",
            pendingId: existing.pendingId || "",
            name: name,
            type: existing.type || "",
            size: existing.size || 0,
            originalName: existing.originalName || ""
        });
    });

    setCardPhotoEntries(card, nextEntries);
}

function releaseDraftPhotoEntry(entry) {
    if (!entry || !entry.pendingId) {
        return;
    }

    draftPhotoBlobs.delete(entry.pendingId);
}

function releaseCardDraftPhotos(card) {
    const entries = getCardPhotoEntries(card);
    entries.forEach(releaseDraftPhotoEntry);
}

function releaseCurrentDraftPhotos() {
    elements.strataList.querySelectorAll(".stratum-card").forEach(function (card) {
        releaseCardDraftPhotos(card);
    });
}

async function persistPhotoEntries(entries) {
    const normalizedEntries = Array.isArray(entries)
        ? entries.map(normalizePhotoEntry)
        : [];

    const pendingEntries = normalizedEntries.filter(function (entry) {
        return Boolean(entry.pendingId);
    });

    if (pendingEntries.length > 0 && !("indexedDB" in window)) {
        throw new Error("Photo storage is not available in this browser.");
    }

    const persistedEntries = [];

    for (const entry of normalizedEntries) {
        if (entry.pendingId) {
            const blobValue = draftPhotoBlobs.get(entry.pendingId);

            if (!blobValue) {
                throw new Error("A selected photo could not be found in memory. Re-add the photo and try again.");
            }

            const photoId = createPhotoRecordId();
            await savePhotoBlobToDatabase(photoId, blobValue);
            draftPhotoBlobs.delete(entry.pendingId);

            persistedEntries.push(normalizePhotoEntry({
                id: photoId,
                name: entry.name,
                type: entry.type || blobValue.type || "",
                size: entry.size || blobValue.size || 0,
                originalName: entry.originalName || ""
            }));

            continue;
        }

        persistedEntries.push(normalizePhotoEntry({
            id: entry.id,
            name: entry.name,
            type: entry.type,
            size: entry.size,
            originalName: entry.originalName
        }));
    }

    return persistedEntries;
}

async function persistCardPhotoEntries(card) {
    const entries = getCardPhotoEntries(card);
    const persistedEntries = await persistPhotoEntries(entries);
    setCardPhotoEntries(card, persistedEntries);
    return persistedEntries;
}

function getStratumPhotoEntries(stratum) {
    if (Array.isArray(stratum.photos)) {
        return stratum.photos.map(normalizePhotoEntry);
    }

    if (Array.isArray(stratum.photoNames)) {
        return stratum.photoNames.map(function (name) {
            return normalizePhotoEntry({ name: name });
        });
    }

    return [];
}

function getStratumPhotoNames(stratum) {
    return getStratumPhotoEntries(stratum).map(function (entry) {
        return entry.name;
    }).filter(Boolean);
}

function collectPhotoIdsFromStps(stps) {
    const photoIds = new Set();

    (stps || []).forEach(function (stp) {
        (stp.strata || []).forEach(function (stratum) {
            getStratumPhotoEntries(stratum).forEach(function (entry) {
                if (entry.id) {
                    photoIds.add(entry.id);
                }
            });
        });
    });

    return Array.from(photoIds);
}

function collectPhotoIdsFromProjects(projects) {
    const photoIds = new Set();

    (projects || []).forEach(function (project) {
        collectPhotoIdsFromStps(project.stps || []).forEach(function (photoId) {
            photoIds.add(photoId);
        });
    });

    return Array.from(photoIds);
}

async function cleanupDeletedPhotoIds(candidatePhotoIds, projectsSnapshot) {
    const candidates = Array.from(new Set((candidatePhotoIds || []).filter(Boolean)));

    if (candidates.length === 0) {
        return;
    }

    const keepIds = new Set();

    collectPhotoIdsFromStps(state.stps).forEach(function (photoId) {
        keepIds.add(photoId);
    });

    const projects = Array.isArray(projectsSnapshot) ? projectsSnapshot : loadProjectsStore();
    collectPhotoIdsFromProjects(projects).forEach(function (photoId) {
        keepIds.add(photoId);
    });

    const deletableIds = candidates.filter(function (photoId) {
        return !keepIds.has(photoId);
    });

    await deletePhotoBlobsFromDatabase(deletableIds);
}

function setPhotoWarning(card, text) {
    card.dataset.photoWarning = text || "";
}

function validatePhotoNamesForCard(card) {
    const names = getCardPhotoNames(card);

    if (names.length === 0) {
        card.dataset.photosValid = "true";
        setPhotoWarning(card, "");
        return true;
    }

    const prefix = card.dataset.photoPrefix || "";
    const namePattern = new RegExp("^" + escapeRegExp(prefix) + "_\\d+\\.[A-Za-z0-9]+$", "i");
    const invalidNames = names.filter(function (name) {
        return !namePattern.test(name);
    });

    if (invalidNames.length > 0) {
        card.dataset.photosValid = "false";
        setPhotoWarning(card, "Rename photos to match: " + prefix + "_01.jpg (first invalid: " + invalidNames[0] + ")");
        return false;
    }

    card.dataset.photosValid = "true";
    setPhotoWarning(card, "");
    return true;
}

function renderPhotoListForCard(card) {
    const listElement = card.querySelector("[data-photo-list]");
    const warningElement = card.querySelector("[data-photo-warning]");

    if (!listElement || !warningElement) {
        return;
    }

    const names = getCardPhotoNames(card);
    listElement.innerHTML = "";

    if (names.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No files selected.";
        listElement.appendChild(emptyItem);
    } else {
        names.forEach(function (name, index) {
            const item = document.createElement("li");
            item.className = "photo-item";

            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.className = "photo-name-input";
            nameInput.value = name;
            nameInput.setAttribute("data-photo-name-input", "true");
            nameInput.setAttribute("data-photo-index", String(index));
            nameInput.setAttribute("aria-label", "Photo name " + String(index + 1));

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "photo-remove-button";
            removeButton.setAttribute("data-photo-remove", String(index));
            removeButton.textContent = "Delete";

            item.appendChild(nameInput);
            item.appendChild(removeButton);
            listElement.appendChild(item);
        });
    }

    warningElement.textContent = card.dataset.photoWarning || "";
}

function findFirstInvalidPhotoCard() {
    const cards = Array.from(elements.strataList.querySelectorAll(".stratum-card"));

    return cards.find(function (card) {
        return card.dataset.photosValid === "false";
    });
}

function getBaseStpLabels() {
    const labels = new Set();

    state.stps.forEach(function (stp) {
        const type = stp.entryType || "base";
        if (type === "base" && stp.stpLabel) {
            labels.add(stp.stpLabel);
        }
    });

    return Array.from(labels).sort();
}

function refreshParentStpOptions() {
    const currentValue = elements.parentStp.value;
    const baseLabels = getBaseStpLabels();

    elements.parentStp.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select base STP";
    elements.parentStp.appendChild(defaultOption);

    baseLabels.forEach(function (label) {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        elements.parentStp.appendChild(option);
    });

    if (baseLabels.includes(currentValue)) {
        elements.parentStp.value = currentValue;
    } else {
        elements.parentStp.value = "";
    }
}

function updateStpTypeUi() {
    const isSupplemental = elements.stpEntryType.value === "supplemental";

    elements.parentStp.disabled = !isSupplemental;
    elements.parentStp.required = isSupplemental;
    elements.supDirection.required = isSupplemental;

    if (!isSupplemental) {
        elements.parentStp.value = "";
        elements.supDirection.value = "";
    }
}

function resetCurrentStp(shouldFocus) {
    releaseCurrentDraftPhotos();
    elements.strataList.innerHTML = "";
    addStratumCard();

    elements.stpEntryType.value = "base";
    elements.gpsLatitude.value = "";
    elements.gpsLongitude.value = "";

    updateStpTypeUi();
    refreshParentStpOptions();

    if (state.stps.length > 0) {
        const lastLabel = state.stps[state.stps.length - 1].stpLabel;
        elements.stpLabel.value = suggestNextStpLabel(lastLabel);
    } else {
        elements.stpLabel.value = "";
    }

    refreshPhotoRulesAll();

    if (shouldFocus) {
        elements.stpLabel.focus();
    }
}

async function saveCurrentStp() {
    updateSiteDraft();

    if (!elements.entryForm.reportValidity()) {
        return;
    }

    if (elements.stpEntryType.value === "supplemental" && !elements.parentStp.value) {
        alert("Choose a parent base STP for supplemental entries.");
        elements.parentStp.focus();
        return;
    }

    const invalidPhotoCard = findFirstInvalidPhotoCard();
    if (invalidPhotoCard) {
        alert("One or more photo names do not match the naming rule. Edit or delete invalid names before saving.");
        const photoNameInput = invalidPhotoCard.querySelector("[data-photo-name-input]");
        if (photoNameInput) {
            photoNameInput.focus();
        }
        return;
    }

    elements.saveStpButton.disabled = true;

    try {
        const currentStp = await collectCurrentStp();
        state.stps.push(currentStp);
        saveSession();
        refreshParentStpOptions();
        renderSavedStps();
        resetCurrentStp(true);
    } catch (error) {
        console.warn("Could not save STP photos.", error);
        alert("Photos could not be saved for this STP. " + (error && error.message ? error.message : "Try uploading the photos again."));
    } finally {
        elements.saveStpButton.disabled = false;
    }
}

async function collectCurrentStp() {
    const strata = [];
    const cards = Array.from(elements.strataList.querySelectorAll(".stratum-card"));

    for (const card of cards) {
        const persistedPhotoEntries = await persistCardPhotoEntries(card);
        const photoNames = persistedPhotoEntries.map(function (entry) {
            return entry.name;
        }).filter(Boolean);

        const savedPhotos = persistedPhotoEntries.map(function (entry) {
            return {
                id: entry.id,
                name: entry.name,
                type: entry.type,
                size: entry.size
            };
        });

        strata.push({
            stratumLabel: card.querySelector('[data-field="stratumLabel"]').value,
            depth: card.querySelector('[data-field="depth"]').value.trim(),
            munsell: card.querySelector('[data-field="munsell"]').value.trim(),
            soilType: card.querySelector('[data-field="soilType"]').value.trim(),
            horizon: card.querySelector('[data-field="horizon"]').value.trim(),
            artifactCatalog: card.querySelector('[data-field="artifactCatalog"]').value.trim(),
            artifactSummary: card.querySelector('[data-field="artifactSummary"]').value.trim(),
            notes: card.querySelector('[data-field="notes"]').value.trim(),
            photoNames: photoNames,
            photos: savedPhotos
        });
    }

    strata.sort(function (a, b) {
        return Number(a.stratumLabel) - Number(b.stratumLabel);
    });

    return {
        siteName: state.siteName,
        siteLocation: state.siteLocation,
        depthUnit: state.depthUnit,
        stpLabel: elements.stpLabel.value.trim(),
        entryType: elements.stpEntryType.value,
        parentStp: elements.parentStp.value,
        supDirection: elements.supDirection.value,
        gpsLatitude: elements.gpsLatitude.value.trim(),
        gpsLongitude: elements.gpsLongitude.value.trim(),
        savedAt: new Date().toISOString(),
        strata: strata
    };
}

function renderSavedStps() {
    elements.savedStpList.innerHTML = "";

    if (state.stps.length === 0) {
        elements.savedEmptyState.hidden = false;
        elements.sessionStatus.textContent = "0 STPs saved";
        return;
    }

    elements.savedEmptyState.hidden = true;
    elements.sessionStatus.textContent = state.stps.length + (state.stps.length === 1 ? " STP saved" : " STPs saved");

    state.stps.forEach(function (stp) {
        const card = document.createElement("article");
        card.className = "saved-stp";

        const header = document.createElement("div");
        header.className = "saved-stp-head";

        const titleWrap = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = stp.stpLabel;

        const meta = document.createElement("p");
        meta.className = "saved-stp-meta";

        const type = stp.entryType || "base";
        const supDisplay = stp.supDirection ? (" | Sup " + stp.supDirection) : "";
        const parentDisplay = stp.parentStp ? (" | Parent " + stp.parentStp) : "";
        const gpsDisplay = (stp.gpsLatitude || stp.gpsLongitude)
            ? (" | GPS " + (stp.gpsLatitude || "-") + ", " + (stp.gpsLongitude || "-"))
            : "";

        meta.textContent = stp.siteName + " | " + stp.siteLocation + " | " + type + parentDisplay + supDisplay + gpsDisplay + " | " + (stp.depthUnit || "metric") + " | " + stp.strata.length + (stp.strata.length === 1 ? " stratum" : " strata");

        titleWrap.appendChild(title);
        titleWrap.appendChild(meta);
        header.appendChild(titleWrap);

        const table = document.createElement("table");
        table.className = "saved-strata";

        const headRow = document.createElement("tr");
        ["Stratum", "Depth", "Munsell", "Soil Type", "Horizon", "Artifact Catalog", "Artifact Summary", "Photos", "Notes"].forEach(function (label) {
            const heading = document.createElement("th");
            heading.textContent = label;
            headRow.appendChild(heading);
        });

        const thead = document.createElement("thead");
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        stp.strata.forEach(function (stratum) {
            const row = document.createElement("tr");

            const photoText = getStratumPhotoNames(stratum).join("; ");

            [
                stratum.stratumLabel,
                stratum.depth,
                stratum.munsell,
                stratum.soilType,
                stratum.horizon,
                stratum.artifactCatalog,
                stratum.artifactSummary,
                photoText,
                stratum.notes
            ].forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value || "-";
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        card.appendChild(header);
        card.appendChild(table);
        elements.savedStpList.appendChild(card);
    });
}

function suggestFromCurrentInput() {
    const currentLabel = elements.stpLabel.value.trim();
    const baseLabel = currentLabel || (state.stps.length > 0 ? state.stps[state.stps.length - 1].stpLabel : "");
    const suggestion = suggestNextStpLabel(baseLabel);

    if (!suggestion) {
        alert("Try entering a label like A1, A2, or B3 first.");
        return;
    }

    elements.stpLabel.value = suggestion;
    refreshPhotoRulesAll();
}

function suggestNextStpLabel(label) {
    const parts = /^([A-Za-z]+)(\d+)$/.exec(label || "");

    if (!parts) {
        return "";
    }

    const prefix = parts[1].toUpperCase();
    const currentNumber = Number(parts[2]);

    if (Number.isNaN(currentNumber)) {
        return "";
    }

    return prefix + String(currentNumber + 1);
}

function applyDepthUnitUi() {
    const unit = elements.depthUnit.value;
    const placeholderMap = {
        metric: "0-20 cm",
        standard: "0-8 in",
        "engineering-feet": "0.00 ft"
    };

    elements.strataList.querySelectorAll('[data-field="depth"]').forEach(function (field) {
        field.placeholder = placeholderMap[unit] || "0-20 cm";
    });
}

function parseStpLabel(stpLabel) {
    const match = /^([A-Za-z]+)\s*(\d+)$/.exec((stpLabel || "").trim());

    if (!match) {
        return {
            transect: "",
            unit: ""
        };
    }

    return {
        transect: match[1].toUpperCase(),
        unit: match[2]
    };
}

function parseMunsellValue(munsellText) {
    const cleanText = (munsellText || "").trim();

    if (!cleanText) {
        return {
            munsell1: "",
            munsell2: "",
            munsell3: "",
            munsellCombined: ""
        };
    }

    const compactText = cleanText
        .replace(/\s*\/\s*/g, "/")
        .replace(/\s+/g, "");

    const compactMatch = /^([0-9.]*[A-Za-z]+)([0-9.]+\/)([0-9.]+)$/.exec(compactText);

    if (compactMatch) {
        const munsell1 = compactMatch[1].toUpperCase();
        const munsell2 = compactMatch[2];
        const munsell3 = compactMatch[3];

        return {
            munsell1: munsell1,
            munsell2: munsell2,
            munsell3: munsell3,
            munsellCombined: munsell1 + munsell2 + munsell3
        };
    }

    return {
        munsell1: cleanText,
        munsell2: "",
        munsell3: "",
        munsellCombined: cleanText
    };
}

function getExportStpLabel(stp) {
    const type = stp.entryType || "base";

    if (type === "supplemental" && stp.parentStp) {
        return stp.parentStp;
    }

    return stp.stpLabel || "";
}

function getMunsellPartsForExport(stratum) {
    const m1 = (stratum.munsell1 || "").trim();
    const m2 = (stratum.munsell2 || "").trim();
    const m3 = (stratum.munsell3 || "").trim();
    const combined = (stratum.munsell || "").trim();

    if (m1 || m2 || m3) {
        return {
            munsell1: m1,
            munsell2: m2,
            munsell3: m3,
            munsellCombined: combined || (m1 + m2 + m3)
        };
    }

    return parseMunsellValue(combined);
}

function buildFlatExportRows() {
    const rows = [];

    state.stps.forEach(function (stp) {
        const exportStp = getExportStpLabel(stp);
        const stpParts = parseStpLabel(exportStp);

        stp.strata.forEach(function (stratum) {
            const photoNames = getStratumPhotoNames(stratum).join("; ");

            rows.push({
                "Sup": stp.supDirection || "",
                "Transect": stpParts.transect,
                "Unit": stpParts.unit,
                "STP": exportStp,
                "Stratum": stratum.stratumLabel,
                "Depth": stratum.depth,
                "Munsell": stratum.munsell,
                "Texture": stratum.soilType,
                "Horizon": stratum.horizon,
                "Notes/Inclusions": stratum.notes,
                "Artifact Catalog": stratum.artifactCatalog || "",
                "Artifact Summary": stratum.artifactSummary || "",
                "Photo Names": photoNames,
                "Site Name": stp.siteName,
                "Site Location": stp.siteLocation,
                "Depth Unit": stp.depthUnit || "metric",
                "STP Entry Type": stp.entryType || "base",
                "Parent STP": stp.parentStp || "",
                "Recorded STP Label": stp.stpLabel || "",
                "GPS Latitude": stp.gpsLatitude || "",
                "GPS Longitude": stp.gpsLongitude || ""
            });
        });
    });

    return rows;
}

function getExportHeaders() {
    return [
        "Sup",
        "Transect",
        "Unit",
        "STP",
        "Stratum",
        "Depth",
        "Munsell",
        "Texture",
        "Horizon",
        "Notes/Inclusions",
        "Artifact Catalog",
        "Artifact Summary",
        "Photo Names",
        "Site Name",
        "Site Location",
        "Depth Unit",
        "STP Entry Type",
        "Parent STP",
        "Recorded STP Label",
        "GPS Latitude",
        "GPS Longitude"
    ];
}

function buildFilenameBase() {
    return (state.siteName || "archaeolab-stp-export")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function downloadExcelReadyXlsx() {
    if (state.stps.length === 0) {
        alert("Save at least one STP before downloading the Excel-ready export.");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("XLSX export library was not loaded. Downloading CSV instead.");
        downloadExcelReadyCsv();
        return;
    }

    const exportRows = buildFlatExportRows();
    const headers = getExportHeaders();
    const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "STPs_Export");

    const filenameBase = buildFilenameBase() || "archaeolab-stp-export";
    XLSX.writeFile(workbook, filenameBase + ".xlsx");
}

function escapeCsvValue(value) {
    const stringValue = String(value == null ? "" : value);

    if (/[",\n]/.test(stringValue)) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
    }

    return stringValue;
}

function downloadExcelReadyCsv() {
    if (state.stps.length === 0) {
        alert("Save at least one STP before downloading CSV.");
        return;
    }

    const exportRows = buildFlatExportRows();
    const headers = getExportHeaders();
    const csvLines = [headers.join(",")];

    exportRows.forEach(function (row) {
        const line = headers.map(function (header) {
            return escapeCsvValue(row[header]);
        }).join(",");

        csvLines.push(line);
    });

    const filenameBase = buildFilenameBase() || "archaeolab-stp-export";
    const fileBlob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = filenameBase + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
}

function downloadSessionData() {
    if (state.stps.length === 0) {
        alert("Save at least one STP before downloading the session backup.");
        return;
    }

    const filenameBase = (state.siteName || "archaeolab-stp-session")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const fileBlob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = (filenameBase || "archaeolab-stp-session") + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
}

async function clearSession() {
    if (!confirm("Clear the saved STP session and start over?")) {
        return;
    }

    const removedPhotoIds = collectPhotoIdsFromStps(state.stps);

    state.siteName = "";
    state.siteLocation = "";
    state.depthUnit = "metric";
    state.stps = [];
    state.projectImage = "";

    localStorage.removeItem(storageKey);
    populateSiteFields();
    refreshParentStpOptions();
    renderSavedStps();
    renderProjectBanner();
    setProjectImageMessage("", false);
    elements.projectImageInput.value = "";
    resetCurrentStp(true);

    try {
        await cleanupDeletedPhotoIds(removedPhotoIds);
    } catch (error) {
        console.warn("Could not remove deleted session photos.", error);
    }
}

function loadProjectsStore() {
    try {
        const raw = localStorage.getItem(projectsStorageKey);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveProjectsStore(projects) {
    try {
        localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
        return true;
    } catch (error) {
        console.warn("Could not save projects.", error);
        alert("Project could not be saved. Try a smaller map image or delete an older saved project.");
        return false;
    }
}

function saveProjectAndStartNew() {
    if (state.stps.length === 0) {
        alert("Save at least one STP before saving a project.");
        return;
    }

    const defaultName = state.siteName || "Untitled Project";
    const projectName = prompt("Enter a name for this project:", defaultName);

    if (projectName === null) {
        return;
    }

    const projects = loadProjectsStore();
    projects.push({
        id: String(Date.now()),
        name: projectName.trim() || defaultName,
        savedAt: new Date().toISOString(),
        siteName: state.siteName,
        siteLocation: state.siteLocation,
        depthUnit: state.depthUnit,
        stps: state.stps,
        projectImage: state.projectImage
    });

    if (!saveProjectsStore(projects)) {
        return;
    }

    renderProjects();

    state.siteName = "";
    state.siteLocation = "";
    state.depthUnit = "metric";
    state.stps = [];
    state.projectImage = "";

    localStorage.removeItem(storageKey);
    populateSiteFields();
    refreshParentStpOptions();
    renderSavedStps();
    renderProjectBanner();
    setProjectImageMessage("", false);
    elements.projectImageInput.value = "";
    resetCurrentStp(true);
}

async function loadProject(projectId) {
    if (!confirm("Loading this project will replace the current session. Continue?")) {
        return;
    }

    const previousSessionPhotoIds = collectPhotoIdsFromStps(state.stps);

    const projects = loadProjectsStore();
    const project = projects.find(function (p) {
        return p.id === projectId;
    });

    if (!project) {
        alert("Project not found.");
        return;
    }

    state.siteName = project.siteName || "";
    state.siteLocation = project.siteLocation || "";
    state.depthUnit = project.depthUnit || "metric";
    state.stps = Array.isArray(project.stps) ? project.stps : [];
    state.projectImage = project.projectImage || "";

    if (!saveSession()) {
        alert("This project is too large for browser storage. Try a smaller map image.");
    }

    populateSiteFields();
    refreshParentStpOptions();
    renderSavedStps();
    renderProjectBanner();
    setProjectImageMessage("", false);
    elements.projectImageInput.value = "";
    resetCurrentStp(false);

    try {
        await cleanupDeletedPhotoIds(previousSessionPhotoIds, projects);
    } catch (error) {
        console.warn("Could not clean up replaced session photos.", error);
    }
}

async function deleteProject(projectId) {
    if (!confirm("Delete this saved project? This cannot be undone.")) {
        return;
    }

    const existingProjects = loadProjectsStore();
    const removedProject = existingProjects.find(function (project) {
        return project.id === projectId;
    });

    const projects = existingProjects.filter(function (p) {
        return p.id !== projectId;
    });

    if (!saveProjectsStore(projects)) {
        return;
    }

    renderProjects();

    const removedPhotoIds = removedProject ? collectPhotoIdsFromStps(removedProject.stps || []) : [];

    try {
        await cleanupDeletedPhotoIds(removedPhotoIds, projects);
    } catch (error) {
        console.warn("Could not clean up deleted project photos.", error);
    }
}

function renderProjects() {
    const projects = loadProjectsStore();
    elements.projectsList.innerHTML = "";

    if (projects.length === 0) {
        elements.projectsEmptyState.hidden = false;
        return;
    }

    elements.projectsEmptyState.hidden = true;

    projects.slice().reverse().forEach(function (project) {
        const card = document.createElement("article");
        card.className = "saved-stp";

        const head = document.createElement("div");
        head.className = "saved-stp-head";

        const titleWrap = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = project.name;

        const meta = document.createElement("p");
        meta.className = "saved-stp-meta";
        const stpCount = Array.isArray(project.stps) ? project.stps.length : 0;
        const savedDate = project.savedAt ? new Date(project.savedAt).toLocaleDateString() : "";
        const metaParts = [
            project.siteName,
            project.siteLocation,
            stpCount + (stpCount === 1 ? " STP" : " STPs"),
            savedDate
        ].filter(Boolean);
        meta.textContent = metaParts.join(" | ");

        titleWrap.appendChild(title);
        titleWrap.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "section-actions";

        const loadBtn = document.createElement("button");
        loadBtn.type = "button";
        loadBtn.className = "secondary-button";
        loadBtn.textContent = "Load";
        loadBtn.addEventListener("click", function () {
            loadProject(project.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "ghost-button";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteProject(project.id);
        });

        actions.appendChild(loadBtn);
        actions.appendChild(deleteBtn);
        head.appendChild(titleWrap);
        head.appendChild(actions);
        card.appendChild(head);
        elements.projectsList.appendChild(card);
    });
}

function isSupportedProjectImage(file) {
    const fileType = (file.type || "").toLowerCase();
    if (supportedProjectImageTypes.includes(fileType)) {
        return true;
    }

    const fileName = (file.name || "").toLowerCase();
    return supportedProjectImageExtensions.some(function (extension) {
        return fileName.endsWith(extension);
    });
}

function bytesToMegabytesText(value) {
    return (value / (1024 * 1024)).toFixed(1);
}

function setProjectImageMessage(text, isError) {
    if (!elements.projectImageMessage) {
        return;
    }

    elements.projectImageMessage.textContent = text || "";
    elements.projectImageMessage.classList.toggle("is-error", Boolean(isError));
}

function handleProjectBannerKeyDown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    event.preventDefault();
    openMapViewer();
}

function handleMapViewerClick(event) {
    if (event.target === elements.mapViewerModal) {
        closeMapViewer();
    }
}

function handleMapViewerEscape(event) {
    if (event.key === "Escape") {
        closeMapViewer();
    }
}

function openMapViewer() {
    if (!state.projectImage) {
        return;
    }

    const mapWindow = window.open("", "_blank");

    if (!mapWindow) {
        setProjectImageMessage("Popup blocked. Allow popups to open the map in a new page.", true);
        elements.mapViewerImage.src = state.projectImage;
        elements.mapViewerModal.hidden = false;
        elements.mapViewerModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        elements.closeMapViewerButton.focus();
        return;
    }

    const pageTitle = (state.siteName || "Project") + " Map Reference";
    const viewerMarkup = [
        "<!DOCTYPE html>",
        "<html lang=\"en\">",
        "<head>",
        "<meta charset=\"utf-8\">",
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
        "<title>" + pageTitle + "</title>",
        "<style>",
        "body{margin:0;min-height:100vh;background:#181d1b;color:#f3efe7;font-family:Trebuchet MS,Gill Sans,sans-serif;display:grid;grid-template-rows:auto 1fr}",
        ".top{padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;background:#232b28}",
        ".title{margin:0;font-size:0.95rem;opacity:0.9}",
        "button{border:none;border-radius:999px;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer;background:#6f4e37;color:#fff}",
        ".wrap{display:grid;place-items:center;padding:10px}",
        "img{max-width:100%;max-height:calc(100vh - 72px);object-fit:contain;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:#121614}",
        "</style>",
        "</head>",
        "<body>",
        "<div class=\"top\"><p class=\"title\">" + pageTitle + "</p><button type=\"button\" onclick=\"window.close()\">Close</button></div>",
        "<div class=\"wrap\"><img id=\"mapReferenceImage\" alt=\"Project map reference\"></div>",
        "</body>",
        "</html>"
    ].join("");

    mapWindow.document.open();
    mapWindow.document.write(viewerMarkup);
    mapWindow.document.close();

    const mapImage = mapWindow.document.getElementById("mapReferenceImage");
    if (mapImage) {
        mapImage.src = state.projectImage;
    }

    setProjectImageMessage("Opened map in a new page.", false);
}

function closeMapViewer() {
    if (elements.mapViewerModal.hidden) {
        return;
    }

    elements.mapViewerModal.hidden = true;
    elements.mapViewerModal.setAttribute("aria-hidden", "true");
    elements.mapViewerImage.src = "";
    document.body.style.overflow = "";
}

function handleProjectImageUpload() {
    const file = elements.projectImageInput.files[0];

    if (!file) {
        return;
    }

    if (!isSupportedProjectImage(file)) {
        setProjectImageMessage("Unsupported file type. Use JPG, PNG, or WEBP.", true);
        elements.projectImageInput.value = "";
        return;
    }

    if (file.size > maxProjectImageSizeBytes) {
        setProjectImageMessage("File is too large. Maximum size is 3 MB.", true);
        elements.projectImageInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", function () {
        const previousImage = state.projectImage;
        state.projectImage = String(reader.result || "");

        if (!saveSession()) {
            state.projectImage = previousImage;
            renderProjectBanner();
            setProjectImageMessage("Image could not be saved. Use a smaller file.", true);
            elements.projectImageInput.value = "";
            return;
        }

        renderProjectBanner();
        setProjectImageMessage(
            "Map image loaded: " + file.name + " (" + bytesToMegabytesText(file.size) + " MB). Click map to open a new page reference.",
            false
        );
    });

    reader.addEventListener("error", function () {
        setProjectImageMessage("Image could not be read. Try a different file.", true);
        elements.projectImageInput.value = "";
    });

    reader.readAsDataURL(file);
}

function removeProjectImage() {
    state.projectImage = "";
    elements.projectImageInput.value = "";
    saveSession();
    renderProjectBanner();
    closeMapViewer();
    setProjectImageMessage("Map image removed.", false);
}

function renderProjectBanner() {
    const hasImage = Boolean(state.projectImage);
    elements.projectBannerImg.hidden = !hasImage;
    elements.projectBannerEmpty.hidden = hasImage;
    elements.removeProjectImageButton.hidden = !hasImage;
    elements.projectBannerImg.classList.toggle("is-clickable", hasImage);
    elements.projectBannerImg.tabIndex = hasImage ? 0 : -1;
    elements.projectBannerImg.title = hasImage ? "Open map in a new page" : "";

    if (hasImage) {
        elements.projectBannerImg.src = state.projectImage;
    } else {
        elements.projectBannerImg.src = "";
        closeMapViewer();
    }
}

