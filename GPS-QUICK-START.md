# GPS Infrastructure - Quick Start Testing Guide

## What We Built Today

**Offline-First GPS Data Gathering System** for Crew Chief archaeology app:
- Import survey grid points from CSV or GeoJSON
- Mark STPs at those locations during fieldwork
- See real-time map updates as you work
- Cross-device data sync via CSV export/import
- Works completely offline (no server required)

---

## Quick Start: Test in 5 Minutes

### Step 1: Open the App
```
File → Open: e:\Archaeolab App\index.html
(Or manually navigate to: file:///e:/Archaeolab%20App/index.html)
```

### Step 2: Check DevTools Console (F12)
Should see any error messages. You shouldn't see GPS errors.

### Step 3: Test GPS Import
1. Scroll down in app to "Saved STPs" section
2. Click new button: **"Import GPS Points (CSV/GeoJSON)"**
3. Select file: `test-gps-points.csv`
4. Alert should say: **"Imported 10 GPS points from test-gps-points.csv"**

### Step 4: Check Registry Loaded
In DevTools Console, type:
```javascript
gpsRegistry.points.size
// Should print: 10
```

### Step 5: Open Map Viewer
1. Back in app, scroll to top
2. Add a sample STP (fill bare minimum)
3. Save STP
4. Scroll to "Saved STPs" section
5. Click **"View GPS Points Map"** button

**What you should see**:
- Map loads with Mapbox/USGS tiles
- Orange DASHED circles = imported points (unmarked)
- Red circles = your saved STPs
- List below shows all points

### Step 6: Mark a Point
Back in main app:
1. Create new STP entry
2. For GPS coordinates, copy one from the imported point popup
3. Save STP
4. Go back to map viewer

**What should change**:
- One orange circle should turn GREEN
- Popup should show the STP label you created
- Map updated in real-time ✨

### Step 7: Test Cross-Device Sync
1. Create 3 STPs at imported point locations
2. Save all
3. Scroll to "Saved STPs" section
4. Click **"Download Final CSV (End of Session)"**
5. Save file as `device-a-marked.csv`

**This CSV now contains**:
- All your marked STPs
- GPS coordinates
- Ready to import on another device

---

## Test Files Included

### Sample GPS Points (to import)

**test-gps-points.csv** - 10 points in Manhattan area
```
latitude,longitude,label,type
40.748817,-73.985428,North Grid Point 1,base
40.748650,-73.985200,North Grid Point 2,base
...
```

**test-gps-points.geojson** - 4 survey points in GeoJSON format
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"name": "Survey Point Alpha"},
      "geometry": {"type": "Point", "coordinates": [-73.985550, 40.748950]}
    }
  ]
}
```

---

## What Each Button Does (New)

| Button | Location | Function |
|--------|----------|----------|
| **Import GPS Points** | Saved STPs section | Upload CSV/GeoJSON with survey grid points |
| **View GPS Points Map** | Saved STPs section | Opens interactive map showing all imported + marked points |
| **(implicit real-time)** | Map viewer | Automatically updates when you mark STPs in app |

---

## Testing Checklist ✅

After 5-minute quick start, verify:

### CSV Import
- [ ] Can select `test-gps-points.csv`
- [ ] Alert shows correct count
- [ ] No JavaScript errors in console
- [ ] Map displays all imported points

### Map Visualization
- [ ] Orange circles = unmarked points
- [ ] Red circles = STPs you created
- [ ] Can pan/zoom
- [ ] Can click circle for details popup
- [ ] Layer toggle works (topo/satellite)

### Real-Time Updates
- [ ] Create new STP with GPS from imported point
- [ ] Go back to map → see point turn green
- [ ] No page reload needed

### Data Format
- [ ] Coordinates show 6 decimals (e.g., 40.748817)
- [ ] Popups show source file name
- [ ] Status shows "Marked" or "Not yet marked"

### Cross-Device Prep
- [ ] Can export CSV with marked STPs
- [ ] CSV contains GPS coordinates
- [ ] Could be imported on different device

---

## Troubleshooting

### "Import GPS Points button not visible"
- Scroll down to "Saved STPs" section
- Button appears between Import CSV and Download buttons
- Refresh page if still not visible

### "File picker opens but won't accept file"
- Make sure file is `.csv` or `.geojson`
- File must have proper headers:
  - CSV: `latitude,longitude,label,type`
  - GeoJSON: FeatureCollection with Point geometries

### "Import says 0 points"
- Check CSV format (headers case-sensitive)
- Verify lat/lon values are valid numbers
- Latitude should be -90 to 90
- Longitude should be -180 to 180

### "Map shows red circles but no orange"
- Red = your saved STPs
- Orange = imported points that haven't been marked yet
- Need to import GPS points first with "Import GPS Points" button

### "Map shows no points at all"
- Did you import GPS points? (should see orange circles)
- Did you create any STPs? (should see red circles)
- Try View GPS Points Map button again
- Check browser console (F12) for errors

### "Click Update on map but nothing changes"
- May not be fastest browser response
- Wait 2 seconds and try again
- Refresh map with View GPS Points Map button again

### "Getting 'geolocation not available' message"
- This is fine - location tracking is optional
- Only required if you want "Use Current GPS" button
- Needs HTTPS + permission from user

---

## Advanced: View Internals

### Check Registry State
```javascript
// In DevTools Console:
console.log('Imported points:', gpsRegistry.points.size);
console.log('Marked STPs:', gpsRegistry.stpToPointMap.size);
console.log('Sample point:', Array.from(gpsRegistry.points.values())[0]);
```

### Watch Events
```javascript
// See when points are marked:
gpsEventBus.addEventListener("gps:point-marked", (e) => {
  console.log("Marked:", e.detail.pointId, "to STP index:", e.detail.stpIndex);
});

// See when GP changes:
gpsEventBus.addEventListener("stp:gps-changed", (e) => {
  console.log("STP", e.detail.stpIndex, "GPS updated to", 
    e.detail.gpsLat, e.detail.gpsLon);
});
```

### Check Storage
```javascript
// See how many GPS points in IndexedDB:
const db = await getGpsPointsDatabase();
// (will show in DevTools Applications → IndexedDB)
```

---

## Next Steps After Testing

### If Everything Works ✅
- Infrastructure is ready for field use
- Can proceed to tap-to-mark workflow (optional enhancement)
- Can test on actual Android/iOS phone

### If Issues Found ❌
- Check GPS-TEST-PLAN.md for detailed test cases
- Note errors in DevTools console
- Can add console.log statements to debug

### For Production Deployment
1. Remove test files (test-gps-points.*)
2. Test with real survey grid CSV from your GIS
3. Deploy PWA to phones via app install
4. Train team on import workflow

---

## Files Modified/Added

**New Files**:
- `gps-test-suite.js` - Automated test runner
- `test-gps-points.csv` - Sample GPS data
- `test-gps-points.geojson` - Sample GPS data (GeoJSON format)
- `GPS-TEST-PLAN.md` - Comprehensive test documentation

**Modified Files**:
- `app.js` - GPS registry, import, events, tracking
- `index.html` - Import GPS Points button
- `gps-map.js` - Render imported points, real-time updates

---

## Key Features Available

✅ **Import Functions**
- CSV with columns: latitude, longitude, label, type
- GeoJSON FeatureCollections
- Auto-generates unique IDs per import
- Validates coordinates

✅ **Registry System**
- Stores GPS points in IndexedDB (~500MB quota)
- Tracks which points are marked
- Links GPS points to STPs
- Survives browser restart

✅ **Real-Time Map**
- Live updates when you mark STPs
- Color coding: orange=unmarked, green=marked
- Popup details on click
- Zoom/pan/layer toggle

✅ **Event System**
- Internal pub/sub (no server)
- `GPS_POINT_MARKED`, `GPS_POINT_UNMARKED`, `STP_GPS_CHANGED` events
- Map viewer listens and updates
- Extensible for future features

✅ **Location Tracking**
- Optional `watchPosition()` for current location
- Distance calculations ready (future use)
- Safe fallback if GPS unavailable

✅ **Cross-Device Sync**
- CSV export includes marked STPs
- Import on different phone
- All coordinates preserved (6 decimals)
- Zero data loss

---

**QR Codes for Testing** (if deployed to web):
- (Not available yet - local file:// URL only)
- Will be available after PWA deployment

---

**Questions?** Check console output or review detailed test plan at `GPS-TEST-PLAN.md`
