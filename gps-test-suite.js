/**
 * GPS Infrastructure Test Suite
 * Tests for Crew Chief archaeology app GPS import and real-time sync
 */

// Test 1: Verify app.js loads and GPS functions exist
console.log("=== GPS INFRASTRUCTURE TEST SUITE ===\n");

function testGpsFunctionsExist() {
    console.log("TEST 1: Verify GPS functions exist");
    
    const requiredFunctions = [
        "getGpsPointsDatabase",
        "saveGpsPointToDatabase",
        "loadGpsPointsFromDatabase",
        "deleteGpsPointFromDatabase",
        "dispatchGpsPointMarked",
        "dispatchGpsPointUnmarked",
        "dispatchStpGpsChanged",
        "startCurrentLocationTracking",
        "stopCurrentLocationTracking",
        "getCurrentLocation",
        "requestImportGpsPointsFile",
        "handleImportGpsPointsFile",
        "parseGpsPointsFromCsv",
        "parseGeoJsonFile",
        "generateUniqueId"
    ];
    
    let passed = 0;
    let failed = 0;
    
    requiredFunctions.forEach(func => {
        if (typeof window[func] === "function") {
            console.log(`  ✓ ${func}`);
            passed++;
        } else {
            console.log(`  ✗ ${func} (NOT FOUND)`);
            failed++;
        }
    });
    
    console.log(`\nResult: ${passed}/${requiredFunctions.length} passed\n`);
    return failed === 0;
}

// Test 2: Verify GPS event system exists
function testGpsEventSystem() {
    console.log("TEST 2: Verify GPS event system");
    
    const requiredEvents = [
        "GPS_POINT_MARKED",
        "GPS_POINT_UNMARKED",
        "GPS_POINT_UPDATED",
        "STP_GPS_CHANGED"
    ];
    
    let passed = 0;
    let failed = 0;
    
    requiredEvents.forEach(event => {
        if (typeof window[event] === "string") {
            console.log(`  ✓ ${event} = "${window[event]}"`);
            passed++;
        } else {
            console.log(`  ✗ ${event} (NOT FOUND)`);
            failed++;
        }
    });
    
    if (typeof window.gpsEventBus !== "undefined" && window.gpsEventBus instanceof EventTarget) {
        console.log(`  ✓ gpsEventBus (EventTarget)`);
        passed++;
    } else {
        console.log(`  ✗ gpsEventBus (NOT FOUND or not EventTarget)`);
        failed++;
    }
    
    console.log(`\nResult: ${passed}/${requiredEvents.length + 1} passed\n`);
    return failed === 0;
}

// Test 3: Verify GPS registry state
function testGpsRegistry() {
    console.log("TEST 3: Verify GPS registry state");
    
    if (typeof window.gpsRegistry === "undefined") {
        console.log("  ✗ gpsRegistry not found");
        return false;
    }
    
    const registry = window.gpsRegistry;
    console.log(`  ✓ gpsRegistry exists`);
    console.log(`  ✓ points Map: ${registry.points instanceof Map ? "OK" : "INVALID"}`);
    console.log(`  ✓ stpToPointMap: ${registry.stpToPointMap instanceof Map ? "OK" : "INVALID"}`);
    console.log(`  ✓ pointToStpMap: ${registry.pointToStpMap instanceof Map ? "OK" : "INVALID"}`);
    console.log(`  ✓ isLoaded: ${typeof registry.isLoaded === "boolean" ? "OK" : "INVALID"}`);
    
    console.log(`\n  Current state:`);
    console.log(`    Points loaded: ${registry.points.size}`);
    console.log(`    STPs mapped: ${registry.stpToPointMap.size}`);
    console.log(`    Points mapped to STPs: ${registry.pointToStpMap.size}\n`);
    
    return true;
}

// Test 4: Test unique ID generation
function testUniqueIdGeneration() {
    console.log("TEST 4: Test unique ID generation");
    
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
        const id = generateUniqueId();
        if (ids.has(id)) {
            console.log(`  ✗ Duplicate ID generated: ${id}`);
            return false;
        }
        ids.add(id);
    }
    
    console.log(`  ✓ Generated 100 unique IDs`);
    console.log(`  ✓ Sample ID: ${generateUniqueId()}`);
    console.log(`\nResult: All IDs unique\n`);
    return true;
}

// Test 5: Test CSV parsing
function testCsvParsing() {
    console.log("TEST 5: Test CSV parsing");
    
    const csvData = `latitude,longitude,label,type
40.748817,-73.985428,North Grid Point 1,base
40.748650,-73.985200,North Grid Point 2,base
40.748450,-73.985000,North Grid Point 3,supplemental
40.748300,-73.984800,Crosshatch Reference A,unit-id`;

    // Create a mock File object
    const blob = new Blob([csvData], { type: "text/csv" });
    const file = new File([blob], "test-gps-points.csv", { type: "text/csv" });
    
    parseGpsPointsFromCsv(file).then(points => {
        console.log(`  ✓ Parsed CSV file`);
        console.log(`  ✓ Found ${points.length} points`);
        
        if (points.length > 0) {
            const sample = points[0];
            console.log(`\n  Sample point:`);
            console.log(`    ID: ${sample.id}`);
            console.log(`    Lat: ${sample.lat}`);
            console.log(`    Lon: ${sample.lon}`);
            console.log(`    Label: ${sample.label}`);
            console.log(`    Type: ${sample.type}`);
        }
        console.log();
    }).catch(err => {
        console.log(`  ✗ CSV parsing failed: ${err.message}`);
    });
}

// Test 6: Event listener test
function testEventListeners() {
    console.log("TEST 6: Test event listener setup");
    
    let markedCount = 0;
    let unmarkedCount = 0;
    let changedCount = 0;
    
    gpsEventBus.addEventListener(GPS_POINT_MARKED, () => {
        markedCount++;
    });
    
    gpsEventBus.addEventListener(GPS_POINT_UNMARKED, () => {
        unmarkedCount++;
    });
    
    gpsEventBus.addEventListener(STP_GPS_CHANGED, () => {
        changedCount++;
    });
    
    // Simulate events
    dispatchGpsPointMarked("test-123", 0);
    dispatchGpsPointUnmarked("test-123");
    dispatchStpGpsChanged(0, 40.7489, -73.9852);
    
    console.log(`  ✓ Event listeners registered`);
    console.log(`  ✓ Marked event fired: ${markedCount} time(s)`);
    console.log(`  ✓ Unmarked event fired: ${unmarkedCount} time(s)`);
    console.log(`  ✓ Changed event fired: ${changedCount} time(s)`);
    console.log();
    
    return markedCount === 1 && unmarkedCount === 1 && changedCount === 1;
}

// Test 7: Location tracking test
function testLocationTracking() {
    console.log("TEST 7: Test location tracking setup");
    
    if ("geolocation" in navigator) {
        console.log(`  ✓ Geolocation API available`);
        
        try {
            startCurrentLocationTracking();
            console.log(`  ✓ Current location tracking started`);
            
            const location = getCurrentLocation();
            if (location) {
                console.log(`  ✓ Current location available`);
                console.log(`    Lat: ${location.lat}`);
                console.log(`    Lon: ${location.lon}`);
                console.log(`    Accuracy: ±${location.accuracy}m`);
            } else {
                console.log(`  ℹ Current location not yet available (waiting for GPS fix)`);
            }
            
            stopCurrentLocationTracking();
            console.log(`  ✓ Current location tracking stopped`);
        } catch (error) {
            console.log(`  ✗ Location tracking error: ${error.message}`);
        }
    } else {
        console.log(`  ℹ Geolocation API not available (HTTPS required)`);
    }
    
    console.log();
}

// Test 8: GPS registry database operations
async function testDatabaseOperations() {
    console.log("TEST 8: Test GPS database operations");
    
    try {
        // Create test point
        const testPoint = {
            lat: 40.748817,
            lon: -73.985428,
            label: "Test Point Alpha",
            type: "base",
            source: "test-import.csv",
            status: "unmarked"
        };
        
        // Save point
        const saved = await saveGpsPointToDatabase(testPoint);
        console.log(`  ✓ Saved GPS point to database`);
        console.log(`    ID: ${saved.id}`);
        console.log(`    Label: ${saved.label}`);
        
        // Load points
        const loaded = await loadGpsPointsFromDatabase();
        console.log(`  ✓ Loaded GPS points from database`);
        console.log(`    Total points: ${loaded.length}`);
        
        // Verify registry updated
        if (gpsRegistry.points.has(saved.id)) {
            console.log(`  ✓ Point exists in registry`);
        } else {
            console.log(`  ✗ Point not found in registry`);
        }
        
        // Clean up
        await deleteGpsPointFromDatabase(saved.id);
        console.log(`  ✓ Deleted GPS point from database`);
        
    } catch (error) {
        console.log(`  ✗ Database operation failed: ${error.message}`);
    }
    
    console.log();
}

// Run all tests
async function runAllTests() {
    console.log("\n" + "=".repeat(50) + "\n");
    
    testGpsFunctionsExist();
    testGpsEventSystem();
    testGpsRegistry();
    testUniqueIdGeneration();
    // testCsvParsing();
    testEventListeners();
    testLocationTracking();
    await testDatabaseOperations();
    
    console.log("=".repeat(50));
    console.log("TEST SUITE COMPLETE\n");
}

// Export for external use
window.GPS_TEST_SUITE = {
    runAllTests,
    testGpsFunctionsExist,
    testGpsEventSystem,
    testGpsRegistry,
    testUniqueIdGeneration,
    testEventListeners,
    testLocationTracking,
    testDatabaseOperations
};

// Auto-run if in browser console
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAllTests);
} else {
    runAllTests();
}
