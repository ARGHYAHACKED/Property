# Dynamic Filters - Testing Guide

## Pre-Testing Setup

1. **Ensure backend is running on Render**: https://property-0lu6.onrender.com
2. **Ensure frontend is ready**: Frontend configured with correct API_BASE_URL
3. **Have test data**: At least a few properties/lands in the database

## Test Scenarios

### Test 1: Filter Options Load Correctly
**Steps:**
1. Navigate to Properties page
2. Open browser DevTools → Network tab
3. Check that `GET /api/properties/filters` request completes successfully
4. Verify response contains: `locations`, `areaRanges`, `priceRanges`

**Expected Result:**
- No console errors
- Filter sections show actual data from database
- No "No locations available" placeholder text

---

### Test 2: Location Filtering Works
**Steps:**
1. Note all locations currently in database (e.g., Jaipur, Pune)
2. Check one location checkbox
3. Observe property cards
4. Check another location checkbox
5. Observe property count changes

**Expected Result:**
- Checking Jaipur shows only Jaipur properties
- Checking Pune adds Pune properties to display
- Multiple selections use OR logic (shows both)
- Unchecking hides those properties again

---

### Test 3: Area Range Filtering Works
**Steps:**
1. Look at first property's area value
2. Check corresponding area range (e.g., if area is 7.5 acres, check "5-10 acres")
3. Verify property appears
4. Select another area range
5. Verify properties matching both ranges appear

**Expected Result:**
- Area range checkboxes filter properties by numeric ranges
- Multiple area selections work with OR logic
- Parsing handles decimal areas correctly (7.5, 2.3, etc)

---

### Test 4: Price Range Filtering Works
**Steps:**
1. Note property prices (if not visible, check database or property detail)
2. Select a price range checkbox
3. Verify only properties within that price range appear
4. Select another price range
5. Verify properties from both ranges appear

**Expected Result:**
- Price ranges filter correctly
- Multiple price selections show properties from all selected ranges
- Prices display in Lakh format if needed

---

### Test 5: Show More/Less Buttons Appear
**Steps:**
1. Check if there are more than 5 unique areas in database
2. Look for "Show More" button under Area section
3. Click "Show More" button
4. Verify all area ranges become visible
5. Click "Show Less"
6. Verify back to showing only 5

**Expected Result:**
- "Show More" button only appears if > 5 options
- Button text toggles between "Show More" and "Show Less"
- Clicking button reveals/hides additional filters

---

### Test 6: New Property Updates Filters
**Steps:**
1. Note current locations in filter
2. Click "Want to Sell?" button
3. Fill form with NEW location (not in current filters)
4. Submit form
5. Observe filters
6. Refresh page

**Expected Result:**
- After submission, new location appears in filter dropdown immediately (or after refresh)
- No page reload required (or minimal reload)
- Filter options include newly added property

---

### Test 7: Combined Filters Work Together
**Steps:**
1. Select one location (e.g., Jaipur)
2. Select one area range (e.g., "5-10 acres")
3. Select one price range (e.g., "₹0-20 Lakh")
4. Observe filtered results
5. Add search term in search box
6. Observe further filtering

**Expected Result:**
- Results show only properties matching ALL criteria
- Location AND area AND price AND search = AND logic (all must match)
- Different filter types combine restrictively
- Same filter type selections combine permissively (OR)

---

### Test 8: Mobile Responsiveness
**Steps:**
1. Open Property page on mobile (or use DevTools responsive mode)
2. Filter section should be hidden initially
3. Click "Filter Options" button
4. Filter panel slides out
5. Select some filters
6. Verify mobile scroll works without breaking layout
7. Click "Filter Options" again to collapse

**Expected Result:**
- Filter toggle button visible and functional on mobile
- Filter panel doesn't overlap content awkwardly
- All checkboxes clickable on mobile
- No horizontal scroll issues

---

### Test 9: Empty State Handling
**Steps:**
1. Select very specific filters (e.g., combination that yields no results)
2. Observe property display
3. Deselect all filters
4. Verify all properties reappear

**Expected Result:**
- Message displays "No properties found." when no matches
- Clearing filters restores full property list
- No console errors on empty states

---

### Test 10: Land Filters Work Identically
**Steps:**
1. Repeat Tests 1-9 but on Land.jsx page
2. Verify all functionality mirrors Property.jsx

**Expected Result:**
- Lands page has identical filter functionality to Properties
- Same location, area, price ranges
- Show More buttons work the same way
- New land submission updates filters

---

## Manual API Testing (Using Postman/curl)

### Get Filter Options
```bash
curl "https://property-0lu6.onrender.com/api/properties/filters"
```

Expected Response:
```json
{
  "locations": ["Jaipur", "Pune", "Mumbai"],
  "areaRanges": [
    { "label": "0-5 acres", "min": 0, "max": 5 },
    { "label": "5-10 acres", "min": 5, "max": 10 },
    { "label": "10-20 acres", "min": 10, "max": 20 },
    { "label": "20-55 acres", "min": 20, "max": 55 },
    { "label": "55+ acres", "min": 55, "max": Infinity }
  ],
  "priceRanges": [
    { "label": "₹0-20 Lakh", "min": 0, "max": 2000000 },
    { "label": "₹20-50 Lakh", "min": 2000000, "max": 5000000 },
    ...
  ]
}
```

---

## Debugging Tips

### Issue: Filters Show "No locations available"
- Check network tab for 404 on `/api/properties/filters`
- Verify backend getFilterOptions() function is exported
- Verify route is registered in propertyRoutes.js
- Check backend console for errors

### Issue: Filters Don't Update After Adding Property
- Verify handleSellSubmit includes filter refresh code
- Check that both `setLands()` and filter state setters are called
- Check network tab to see if requests succeeded

### Issue: Area/Price Filtering Not Working
- Check DevTools console for JavaScript errors
- Verify `parseFloat(land.area)` is working
- Check that price values in database are numeric (not strings)
- Look for type mismatch errors in console

### Issue: Show More Button Not Appearing
- Verify areaRanges has > 5 items (check network response)
- Check browser console for state update errors
- Verify `slice(0, showMoreAreas ? ... : 5)` logic is correct

### Issue: Filters Persist After Page Reload
- This is expected - React state resets on refresh
- Filters are refetched from backend each load
- This is correct behavior

---

## Expected Data Types

### Area (land.area)
- Type: String or Number
- Example: "5.5", "10", "25 acres"
- Converted to: `parseFloat()` for comparison

### Price (land.price)
- Type: Number (integer)
- Example: 2500000 (represents ₹25 Lakh)
- Stored as: Paise/smallest unit
- Display as: Lakh (divide by 100000)

### Location (land.location)
- Type: String
- Example: "Jaipur", "Pune", "Mumbai"
- Matching: Exact string match (case-sensitive if needed)

---

## Success Criteria

- [x] All filters load without errors
- [x] Location filtering works exactly
- [x] Area filtering works by range
- [x] Price filtering works by range
- [x] Show More buttons appear for 6+ options
- [x] New properties update filter options
- [x] Multiple selections use correct logic
- [x] Mobile responsive design works
- [x] Empty states handled gracefully
- [x] Land.jsx mirrors Property.jsx functionality
