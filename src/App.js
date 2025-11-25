import React, { useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [sheets, setSheets] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [showTable, setShowTable] = useState(false);

  const [qty, setQty] = useState({});

  const API_BASE = "https://indent-dcsd.onrender.com";

  // Company List
  const companies = [
    "wh", "jolly", "gachibowli", "jh", "kokapet", "meil",
    "eastin", "ipe", "tcc", "tevar", "chubby", "peanut"
  ];


  // Vegetable List
  const vegetables = [
  "arbi",
  "Beet Root",
  "beerakai / turai",
  "Bharat Brinjel",
  "Bhav nagar chilli",
  "Bhendi",
  "Brinjal",
  "Brinjal Long",
  "Brinjal( white)",
  "Cabbage",
  "Capsicum Green",
  "Carrot",
  "Cauliflower",
  "Chikkudukaya",
  "Chips Potato",
  "Cluster Beans",
  "Coconut",
  "DONDAKAYA",
  "Dosaya kaya",
  "Drum sticks (pc)",
  "drumstick (kg)",
  "English KEERA",
  "French beans",
  "Garlic Whole",
  "Ginger",
  "Green Chillies",
  "Kadhu",
  "Karela",
  "Kheera",
  "Lemon (pc)",
  "Lemon kg",
  "Mango-Raw",
  "Mooli (Radish )",
  "Onion (Large )",
  "Parwal",
  "Peeled Garlic",
  "Potato",
  "Pumpkin White",
  "Raw Banana",
  "Raw Papaya",
  "Red Pumpkin",
  "Salan Chillies",
  "Sweet Potato",
  "Tomato Bangalore",
  "Tomato Local",
  "Whole Corn pcs",
  "Yam",
"Coriander",
"Curry leaves",
"Gongura",
"Meti",
"Mint",
"thotakura",
"Palak",
"Spring onion",
"Banana leaves",
"Bachalacura",
"Dil leaf",
"Ponnaganti",
"Chukkakura",
"సేజ్ ఆకు",

"Asparagus",
"Avocado",
"Baby Corn",
"Baby Potato",
"Bean Sprouts",
"Basil Leaves",
"Brocolli",
"Chinese Pockhoy",
"Chinese Cabbage",
"Cabbage red",
"Yellow Capsicum",
"Red Capisum",
"Herb Parsley",
"Herb Rose Mary",
"Herb Thyme",
"Leeks",
"Lemon Grass",
"Lettuce Ice Berg",
"Lettuce Green",
"Lettuce Red",
"Lettuce Stem",
"Lettuce Roman",
"Rocket Lettuce",
"Mushroom",
"Tomato Cherry",
"Zucchini Green",
"Zucchini Yellow",
"Thai Red Chilli",
"Kaffir Lime Leaves",
"Red Raddish",
"Baby Carrot",
"Lotus Stem",
"Galangal Ginger",
"Edible Flower",
"Microgreen box",
"Celery sticks",
"Sambar Onion",
"Sweet corn",
"Greenpeas",

"apple",
"green apple",
"malta orange",
"pears",
"kiwi",
"banana",
"gapes",
"guava",
"pineapple",
"watermelon pcs",
"watermelon ( kg)",
"maskermelon",
"Papaya",
"Pomogrenate",
"mosambi",
"Dragon fruit",

"French fries KG",
"PANEER",
"Whole Corn pcs",
"VEG NUGGETS",
"potalakaya",
"BANANA FLOWER",
"long beans",
"usiri kaya",
"Chow chow",

  ];


  
  // Create or open sheet
  const handleGo = async () => {
    if (!date) {
      setMessage("Please select a date");
      return;
    }
    setMessage("Processing...");

    try {
      const res = await fetch(`${API_BASE}/api/sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage("Error: " + data.error);
      } else if (data.status === "exists") {
        setMessage(`Sheet opened: ${data.sheetName}`);
      } else {
        setMessage(`New sheet created: ${data.sheetName}`);
      }

      refreshSheetList();
    } catch (err) {
      setMessage("Request failed");
    }
  };

  // Refresh sheets list
  const refreshSheetList = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sheets`);
      const data = await res.json();
      if (data.sheets) setSheets(data.sheets);
    } catch (err) {}
  };

  // When company selected → fetch existing quantities
  const handleCompanySelect = async (companyName) => {
    setSelectedCompany(companyName);
    setShowTable(true);
    setMessage("Loading previous values...");

    try {
      const res = await fetch(`${API_BASE}/api/get-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, company: companyName }),
      });

      const data = await res.json();

      if (data.quantities) {
        setQty(data.quantities);
        setMessage("Data loaded");
      } else {
        setMessage("No data found");
      }
    } catch (err) {
      setMessage("Failed to load data");
    }
  };

  // Save changes
  const handleSave = async () => {
    setMessage("Saving...");

    try {
      const res = await fetch(`${API_BASE}/api/update-company`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          company: selectedCompany,
          quantities: qty,
        }),
      });

      const data = await res.json();
      setMessage("Saved successfully");
    } catch (err) {
      setMessage("Save failed");
    }
  };

  const handleDownload = () => {
    window.open(`${API_BASE}/download`, "_blank");
  };

  return (
    <div className="app-container">
      <h2>Vegetable Indent — Excel Entry</h2>

      {/* Date Selection */}
      <div className="form-row">
        <label>Select Date:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={handleGo}>Go</button>
      </div>

      {message && (
        <p><strong>Status:</strong> {message}</p>
      )}

      {/* Company Dropdown */}
      {date && (
        <div className="form-row">
          <label>Company:</label>

          <select
            value={selectedCompany}
            onChange={(e) => handleCompanySelect(e.target.value)}
          >
            <option value="">-- Select --</option>
            {companies.map(c => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      {showTable && (
        <>
          <h3>{selectedCompany.toUpperCase()} — Update Quantities</h3>
           <button onClick={handleSave} style={{ marginTop: 10 }}>
            Save to Excel
          </button>

          <table>
            <thead>
              <tr>
                <th>Vegetable</th>
                <th>Qty</th>
              </tr>
            </thead>

            <tbody>
              {vegetables.map((veg) => (
                <tr key={veg}>
                  <td>{veg}</td>
                  <td>
                    <input
                      type="text"
                      value={qty[veg] || ""}
                      onChange={(e) =>
                        setQty({ ...qty, [veg]: e.target.value })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

         
        </>
      )}

      {/* Sheet list */}
      <div style={{ marginTop: 25 }}>
        <button onClick={refreshSheetList}>Refresh Sheet List</button>
        <button onClick={handleDownload} style={{ marginLeft: 10 }}>
          Download Excel
        </button>

        <ul>
          {sheets.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
