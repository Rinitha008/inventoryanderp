// OmniOps AI - ERP, Inventory & Operations Agent System
// Data Model
const STATE = {
  inventory: [
    { sku: "SKU-M4-SPINDLE", name: "Industrial Spindle M4", category: "Manufacturing", stock: { wha: 42, whb: 8, whc: 55 }, threshold: 20, reorderRecommendation: "None", status: "Optimal" },
    { sku: "SKU-V2-ECOSENS", name: "Eco-Sensor Array V2", category: "IoT Electronics", stock: { wha: 42, whb: 110, whc: 20 }, threshold: 50, reorderRecommendation: "Auto-order 100 qty (Supplier A)", status: "Alert" },
    { sku: "SKU-H9-BEARING", name: "Heavy Duty Bearing Set", category: "Machinery Parts", stock: { wha: 8, whb: 30, whc: 4 }, threshold: 25, reorderRecommendation: "Replenish 50 qty from Apex Inc.", status: "Alert" },
    { sku: "SKU-P3-VALVES", name: "High-Pressure Pneumatic Valve", category: "Fluids/Piping", stock: { wha: 20, whb: 5, whc: 12 }, threshold: 15, reorderRecommendation: "Transfer 10 units from Alpha to Beta", status: "Alert" },
    { sku: "SKU-B8-BATTERY", name: "Lithium Power Module 24V", category: "Power Systems", stock: { wha: 45, whb: 65, whc: 120 }, threshold: 30, reorderRecommendation: "None", status: "Optimal" }
  ],
  assets: [
    { id: "AST-CNC-001", name: "CNC Milling Center V3", location: "wha", health: 92, utilization: 78, lastService: "2026-05-10", nextService: "2026-08-15", riskLevel: "Low", assignedTo: "Alex Rivera" },
    { id: "AST-SPD-005", name: "Industrial Spindle Spindle-V", location: "whb", health: 68, utilization: 84, lastService: "2026-03-22", nextService: "2026-07-20", riskLevel: "Moderate", assignedTo: "Marcus Chen" },
    { id: "AST-PKL-012", name: "Automated Packing Line 4", location: "wha", health: 34, utilization: 92, lastService: "2025-12-15", nextService: "2026-07-12", riskLevel: "Critical", assignedTo: "Sarah Jenkins" },
    { id: "AST-SOV-008", name: "Solder Reflow Oven Gen2", location: "whc", health: 98, utilization: 45, lastService: "2026-06-01", nextService: "2026-10-01", riskLevel: "Low", assignedTo: "Elena Petrova" }
  ],
  logs: [
    { timestamp: "10:48:12", module: "Inventory", details: "Critical understock warning for Heavy Duty Bearing Set at Warehouse Gamma (4 units left).", classification: "warning", confidence: "99.4%" },
    { timestamp: "10:30:45", module: "Safety", details: "Reflow Oven temperature sensor check passed. System operates normally.", classification: "info", confidence: "98.1%" },
    { timestamp: "09:15:22", module: "Procurement", details: "Drafted Replenishment PO-4091 for Eco-Sensor Array V2 (Qty: 100). Awaiting approval.", classification: "success", confidence: "94.8%" },
    { timestamp: "08:00:00", module: "System", details: "OmniOps Agentic Core loaded successfully. Model Llama-3.1-ERP active.", classification: "info", confidence: "100.0%" }
  ],
  transits: [],
  procurementDraftsCount: 2,
  forecastDataSet: {
    actual: [120, 150, 180, 160, 210, 240, 220],
    forecast: [120, 150, 180, 160, 210, 240, 220, 260, 290, 310, 340, 360]
  }
};
// Global variables for Chart and interactive state
let forecastChart = null;
// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initCharts();
  populateUI();
  setupEventListeners();
  addAgentMessage("bot", "Hello! I am your **Optima ERP Agent**. I monitor stock thresholds, warehouse workloads, logistics routes, and factory equipment in real-time. How can I assist you with your operations today?");
});
// Tab Switching System
function initTabs() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const tabId = item.getAttribute("data-tab");
      
      // Update sidebar active class
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      
      // Update Tab Content display
      const tabContents = document.querySelectorAll(".tab-content");
      tabContents.forEach(content => {
        content.classList.remove("active");
      });
      document.getElementById(`tab-${tabId}`).classList.add("active");
      // Update headers
      const pageTitle = document.getElementById("page-title");
      const pageSubtitle = document.getElementById("page-subtitle");
      
      switch (tabId) {
        case "dashboard":
          pageTitle.innerText = "Operations Dashboard";
          pageSubtitle.innerText = "Real-time status updates and telemetry across all nodes.";
          break;
        case "warehouses":
          pageTitle.innerText = "Multi-Location Warehouse HUD";
          pageSubtitle.innerText = "Inter-warehouse logistics, branch occupancies, and routing.";
          break;
        case "inventory":
          pageTitle.innerText = "Smart Inventory & Forecasting";
          pageSubtitle.innerText = "Automated stock catalogs, thresholds, and replenishment schedules.";
          break;
        case "assets":
          pageTitle.innerText = "Asset Lifecycle & Equipment";
          pageSubtitle.innerText = "Track operational machinery health, service schedules, and risk factors.";
          break;
        case "logs":
          pageTitle.innerText = "Detailed ERP Action Ledger";
          pageSubtitle.innerText = "Complete immutable audit feed of operations, AI actions, and user interventions.";
          break;
      }
    });
  });
}
// Chart.js Configuration
function initCharts() {
  const ctx = document.getElementById("forecastChart").getContext("2d");
  
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Actual Sales/Production Demand",
          data: STATE.forecastDataSet.actual,
          borderColor: "#00f2fe",
          backgroundColor: "rgba(0, 242, 254, 0.1)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: "#00f2fe",
          pointRadius: 4
        },
        {
          label: "AI Predicted Forecast (ARIMA)",
          data: STATE.forecastDataSet.forecast,
          borderColor: "#7f00ff",
          backgroundColor: "rgba(127, 0, 255, 0.05)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: "#7f00ff",
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            font: {
              family: "Inter",
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: "rgba(10, 15, 30, 0.95)",
          titleColor: "#00f2fe",
          bodyColor: "#f1f5f9",
          borderColor: "rgba(0, 242, 254, 0.2)",
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.04)"
          },
          ticks: {
            color: "#94a3b8",
            font: {
              family: "Inter",
              size: 10
            }
          }
        },
        y: {
          grid: {
            color: "rgba(255, 255, 255, 0.04)"
          },
          ticks: {
            color: "#94a3b8",
            font: {
              family: "Inter",
              size: 10
            }
          }
        }
      }
    }
  });
}
// Populate UI components dynamically
function populateUI() {
  // Update core telemetry stats
  updateTelemetryStats();
  // Populate Dashboard Decision Stream
  const decisionContainer = document.getElementById("dashboard-decision-stream");
  decisionContainer.innerHTML = "";
  STATE.logs.slice(0, 4).forEach(log => {
    decisionContainer.appendChild(createLogDOMElement(log));
  });
  // Populate Critical Shortfalls (Low Stock)
  populateShortfallsTable();
  // Populate Stock Transfer item dropdown
  const transferItemSelect = document.getElementById("transfer-item");
  transferItemSelect.innerHTML = "";
  STATE.inventory.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.text = item.name;
    transferItemSelect.appendChild(opt);
  });
  // Populate Inventory tab list
  populateInventoryTable();
  // Populate Asset Grid
  populateAssetGrid();
  // Populate Assets maintenance table & dropdowns
  populateAssetsTable();
  // Populate main log table
  populateLogsMainTable();
}
function updateTelemetryStats() {
  // Stat: Total stock items (aggregated)
  const totalStockCount = STATE.inventory.reduce((acc, curr) => {
    return acc + curr.stock.wha + curr.stock.whb + curr.stock.whc;
  }, 0);
  document.getElementById("stat-total-stock").innerText = totalStockCount.toLocaleString();
  // Stat: Low-stock warning count
  const lowStockCount = STATE.inventory.filter(item => {
    return (item.stock.wha < item.threshold || item.stock.whb < item.threshold || item.stock.whc < item.threshold);
  }).length;
  document.getElementById("stat-low-stock").innerText = lowStockCount;
  // Stat: machinery health average
  const avgHealth = STATE.assets.reduce((acc, c) => acc + c.health, 0) / STATE.assets.length;
  document.getElementById("stat-health").innerText = `${avgHealth.toFixed(1)}%`;
  // Stat: Draft POs
  document.getElementById("stat-procurements").innerText = STATE.procurementDraftsCount;
  // Occupancies percentages
  // Max cap: wha = 2500, whb = 3000, whc = 2000
  const whaSum = STATE.inventory.reduce((acc, i) => acc + i.stock.wha, 0);
  const whbSum = STATE.inventory.reduce((acc, i) => acc + i.stock.whb, 0);
  const whcSum = STATE.inventory.reduce((acc, i) => acc + i.stock.whc, 0);
  const whaOcc = Math.round((whaSum / 2500) * 100);
  const whbOcc = Math.round((whbSum / 3000) * 100);
  const whcOcc = Math.round((whcSum / 2000) * 100);
  document.getElementById("occupancy-txt-wha").innerText = `${whaOcc}%`;
  document.getElementById("occupancy-fill-wha").style.width = `${whaOcc}%`;
  document.getElementById("occupancy-txt-whb").innerText = `${whbOcc}%`;
  document.getElementById("occupancy-fill-whb").style.width = `${whbOcc}%`;
  document.getElementById("occupancy-txt-whc").innerText = `${whcOcc}%`;
  document.getElementById("occupancy-fill-whc").style.width = `${whcOcc}%`;
  // Update Warehouse nodes stock in HUD
  document.getElementById("node-stock-wha").innerText = whaSum.toLocaleString();
  document.getElementById("node-occ-wha").innerText = `${whaOcc}%`;
  document.getElementById("node-stock-whb").innerText = whbSum.toLocaleString();
  document.getElementById("node-occ-whb").innerText = `${whbOcc}%`;
  document.getElementById("node-stock-whc").innerText = whcSum.toLocaleString();
  document.getElementById("node-occ-whc").innerText = `${whcOcc}%`;
}
function createLogDOMElement(log) {
  const item = document.createElement("div");
  item.className = `decision-log-item ${log.classification}`;
  item.innerHTML = `
    <div class="decision-time">
      <span>${log.timestamp} | ${log.module}</span>
      <span style="font-weight:600;">AI Conf: ${log.confidence}</span>
    </div>
    <div>${log.details}</div>
  `;
  return item;
}
function populateShortfallsTable() {
  const tbody = document.getElementById("dashboard-shortfalls-tbody");
  tbody.innerHTML = "";
  let shortfalls = [];
  STATE.inventory.forEach(item => {
    ["wha", "whb", "whc"].forEach(loc => {
      const currentStock = item.stock[loc];
      if (currentStock < item.threshold) {
        let locName = loc === "wha" ? "Alpha" : loc === "whb" ? "Beta" : "Gamma";
        shortfalls.push({
          item: item,
          locCode: loc,
          locName: locName,
          stock: currentStock,
          threshold: item.threshold
        });
      }
    });
  });
  if (shortfalls.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No active shortfalls. Operational statuses clean.</td></tr>`;
    return;
  }
  shortfalls.forEach(short => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${short.item.name}</strong></td>
      <td>Warehouse ${short.locName}</td>
      <td class="trend-down" style="font-weight:600;">${short.stock}</td>
      <td>${short.threshold}</td>
      <td>
        <button class="btn-primary" style="padding:4px 8px; font-size:10px;" onclick="triggerQuickReorder('${short.item.sku}', '${short.locCode}')">Reorder</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function populateInventoryTable() {
  const tbody = document.getElementById("inventory-main-tbody");
  tbody.innerHTML = "";
  const searchQuery = document.getElementById("inventory-search").value.toLowerCase();
  const filterLoc = document.getElementById("inventory-filter-location").value;
  STATE.inventory.forEach(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) return;
    // Filter by location columns
    let showRow = false;
    if (filterLoc === "all") {
      showRow = true;
    } else {
      if (item.stock[filterLoc] > 0 || item.stock[filterLoc] < item.threshold) {
        showRow = true;
      }
    }
    if (!showRow) return;
    // Calculate status column
    let statusBadge = `<span class="badge badge-emerald">Optimal</span>`;
    let isAlert = false;
    ["wha", "whb", "whc"].forEach(loc => {
      if (item.stock[loc] < item.threshold) {
        isAlert = true;
      }
    });
    if (isAlert) {
      statusBadge = `<span class="badge badge-amber">Low Stock Warning</span>`;
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family: monospace;">${item.sku}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td>
        <div style="display:flex; flex-direction:column; gap:2px;">
          <span>Alpha (Chi): <strong class="${item.stock.wha < item.threshold ? 'trend-down' : ''}">${item.stock.wha}</strong></span>
          <span>Beta (Aus): <strong class="${item.stock.whb < item.threshold ? 'trend-down' : ''}">${item.stock.whb}</strong></span>
          <span>Gamma (Sea): <strong class="${item.stock.whc < item.threshold ? 'trend-down' : ''}">${item.stock.whc}</strong></span>
        </div>
      </td>
      <td>${item.threshold} units</td>
      <td>Multi-Node</td>
      <td style="color: var(--cyan); font-style:italic;">${item.reorderRecommendation}</td>
      <td>${statusBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}
function populateAssetGrid() {
  const grid = document.getElementById("assets-container-grid");
  grid.innerHTML = "";
  STATE.assets.forEach(asset => {
    const locName = asset.location === "wha" ? "Warehouse Alpha (Chi)" : asset.location === "whb" ? "Warehouse Beta (Aus)" : "Warehouse Gamma (Sea)";
    let healthClass = "asset-health-good";
    let riskBadge = `<span class="badge badge-emerald">Stable</span>`;
    if (asset.health < 50) {
      healthClass = "asset-health-critical";
      riskBadge = `<span class="badge badge-crimson">Urgent Service</span>`;
    } else if (asset.health < 80) {
      healthClass = "asset-health-warning";
      riskBadge = `<span class="badge badge-amber">Investigation</span>`;
    }
    const card = document.createElement("div");
    card.className = "asset-card";
    card.innerHTML = `
      <div class="asset-info-row">
        <span class="asset-name">${asset.name}</span>
        ${riskBadge}
      </div>
      <div class="asset-meta">ID: ${asset.id} | Location: ${locName}</div>
      <div>
        <div class="asset-info-row" style="font-size:11px; margin-bottom: 4px;">
          <span>Telemetry Health</span>
          <span>${asset.health}%</span>
        </div>
        <div class="asset-health-bar">
          <div class="asset-health-fill ${healthClass}" style="width: ${asset.health}%;"></div>
        </div>
      </div>
      <div class="asset-info-row" style="font-size:11px;">
        <span>Usage Utilization:</span>
        <strong style="color:var(--cyan);">${asset.utilization}%</strong>
      </div>
      <button class="btn-secondary" style="font-size:11px; padding: 6px; width:100%; margin-top:8px;" onclick="triggerServiceDispatch('${asset.id}')">
        Perform Preventative Service
      </button>
    `;
    grid.appendChild(card);
  });
}
function populateAssetsTable() {
  const tbody = document.getElementById("assets-maintenance-tbody");
  tbody.innerHTML = "";
  // Dropdown list in log ticket form
  const assetSelect = document.getElementById("issue-asset");
  assetSelect.innerHTML = "";
  STATE.assets.forEach(asset => {
    let riskColor = "trend-neutral";
    if (asset.riskLevel === "Critical") riskColor = "trend-down";
    if (asset.riskLevel === "Moderate") riskColor = "trend-neutral";
    if (asset.riskLevel === "Low") riskColor = "trend-up";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${asset.name}</strong></td>
      <td>Warehouse ${asset.location === 'wha' ? 'Alpha' : asset.location === 'whb' ? 'Beta' : 'Gamma'}</td>
      <td>${asset.lastService}</td>
      <td>${asset.nextService}</td>
      <td class="${riskColor}" style="font-weight:600;">${asset.riskLevel}</td>
      <td>${asset.assignedTo}</td>
    `;
    tbody.appendChild(tr);
    // populate dropdown option
    const opt = document.createElement("option");
    opt.value = asset.id;
    opt.text = asset.name;
    assetSelect.appendChild(opt);
  });
}
function populateLogsMainTable() {
  const tbody = document.getElementById("logs-main-tbody");
  tbody.innerHTML = "";
  const filter = document.getElementById("log-filter-severity").value;
  STATE.logs.forEach(log => {
    if (filter !== "all" && log.classification !== filter) return;
    let badgeClass = "badge-cyan";
    if (log.classification === "success") badgeClass = "badge-emerald";
    if (log.classification === "warning") badgeClass = "badge-amber";
    if (log.classification === "error") badgeClass = "badge-crimson";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:var(--text-muted); font-family:monospace;">${log.timestamp}</td>
      <td><strong>${log.module}</strong></td>
      <td>${log.details}</td>
      <td><span class="badge ${badgeClass}">${log.classification}</span></td>
      <td style="color:var(--cyan); font-weight:600;">${log.confidence}</td>
    `;
    tbody.appendChild(tr);
  });
}
// User-driven Events
function triggerQuickReorder(sku, loc) {
  const item = STATE.inventory.find(i => i.sku === sku);
  if (!item) return;
  STATE.procurementDraftsCount += 1;
  const time = getFormattedTime();
  const locName = loc === "wha" ? "Alpha" : loc === "whb" ? "Beta" : "Gamma";
  logEvent("Procurement", `Auto-replenishment order drafted for ${item.name} at Warehouse ${locName}. Replenishing 50 units.`, "success", "97.5%");
  addAgentMessage("bot", `I have successfully auto-drafted a replenishment purchase order for **${item.name}** at Warehouse ${locName}. The draft has been logged in the ERP action ledger. Operations statistics updated.`);
  showToast("Reorder Draft Created", `Replenishment order for ${item.name} submitted for authorization.`);
  populateUI();
}
function triggerServiceDispatch(assetId) {
  const asset = STATE.assets.find(a => a.id === assetId);
  if (!asset) return;
  asset.health = 100;
  asset.riskLevel = "Low";
  asset.lastService = new Date().toISOString().split('T')[0];
  asset.nextService = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +90 days
  logEvent("Safety", `Preventative dispatch completed for ${asset.name}. Sensor telemetry reset to standard tolerance.`, "success", "99.8%");
  addAgentMessage("bot", `🔧 Service dispatch completed for **${asset.name}**. I have verified that telemetry diagnostics returned a clean health score of **100%**.`);
  showToast("Maintenance Complete", `${asset.name} calibration and system lubrication successfully logged.`);
  populateUI();
}
// Helper: Log event into central ledgers
function logEvent(module, details, classification, confidence) {
  STATE.logs.unshift({
    timestamp: getFormattedTime(),
    module: module,
    details: details,
    classification: classification,
    confidence: confidence
  });
}
function getFormattedTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
// Visual layout notification Toast
function showToast(title, msg, isWarning = false) {
  const toast = document.getElementById("app-toast");
  const tTitle = document.getElementById("toast-title");
  const tMsg = document.getElementById("toast-message");
  const tIconBg = document.getElementById("toast-icon-bg");
  tTitle.innerText = title;
  tMsg.innerText = msg;
  if (isWarning) {
    tIconBg.style.color = "var(--amber)";
    tIconBg.style.background = "rgba(255, 208, 0, 0.1)";
  } else {
    tIconBg.style.color = "var(--cyan)";
    tIconBg.style.background = "rgba(0, 242, 254, 0.1)";
  }
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
// AI Agent Chat Communication
function addAgentMessage(sender, text, actionCards = null) {
  const container = document.getElementById("chat-history-container");
  
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  
  // Format markdown-like lists and bold tags
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
    
  bubble.innerHTML = `<p>${formattedText}</p>`;
  
  if (actionCards) {
    const cardsDiv = document.createElement("div");
    cardsDiv.className = "action-cards";
    actionCards.forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "action-card";
      cardDiv.innerHTML = `
        <span>${card.label}</span>
        <button onclick="${card.action}">${card.btnText}</button>
      `;
      cardsDiv.appendChild(cardDiv);
    });
    bubble.appendChild(cardsDiv);
  }
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}
function showTypingIndicator() {
  document.getElementById("agent-typing").style.display = "flex";
  const container = document.getElementById("chat-history-container");
  container.scrollTop = container.scrollHeight;
}
function hideTypingIndicator() {
  document.getElementById("agent-typing").style.display = "none";
}
// Processes messages sent to the AI ERP Agent
function handleUserMessage(message) {
  if (!message.trim()) return;
  addAgentMessage("user", message);
  showTypingIndicator();
  // Simulate agent reasoning delay
  setTimeout(() => {
    hideTypingIndicator();
    const query = message.toLowerCase();
    // 1. STOCK TRANSFER COMMANDS
    if (query.includes("transfer") || query.includes("move") || query.includes("dispatch")) {
      parseAndExecuteTransfer(query);
    } 
    // 2. FORECAST / PROCUREMENT RECOMMENDATIONS
    else if (query.includes("forecast") || query.includes("demand") || query.includes("procure")) {
      STATE.procurementDraftsCount = 4;
      logEvent("Procurement", "Auto-ARIMA executed demand forecast updates for Q3/Q4 2026. Safety stocks computed.", "success", "95.4%");
      
      // Mutate chart to show elevated forecast
      STATE.forecastDataSet.actual = [120, 150, 180, 160, 210, 240, 220];
      STATE.forecastDataSet.forecast = [120, 150, 180, 160, 210, 240, 220, 290, 340, 380, 410, 440];
      forecastChart.data.datasets[0].data = STATE.forecastDataSet.actual;
      forecastChart.data.datasets[1].data = STATE.forecastDataSet.forecast;
      forecastChart.update();
      addAgentMessage("bot", `I have run the **Auto-ARIMA Demand Model** on active production schedules. 
      <br><br>🚨 **Observation:** Critical raw parts deficits projected for Oct-Dec.
      <br>📈 **Forecast:** Demand spike +24% predicted.
      <br>✅ **Actions:** Auto-drafted **2 replenishment POs** for parts (Eco-Sensor Array, Pneumatic Valves). I have loaded the predicted demand curves onto your Forecast chart on the dashboard.`, [
        { label: "Approve Replenishment POs", btnText: "Authorize POs", action: "authorizeAllPOs()" }
      ]);
      populateUI();
    }
    // 3. EQUIPMENT & MACHINERY HEALTH SCAN
    else if (query.includes("health") || query.includes("maintenance") || query.includes("machine") || query.includes("equipment")) {
      const criticallyDegraded = STATE.assets.filter(a => a.health < 50);
      if (criticallyDegraded.length > 0) {
        addAgentMessage("bot", `Scanned telemetry parameters. Detected **${criticallyDegraded.length} machine(s)** with urgent alerts:
        <br><br>⚠️ **${criticallyDegraded[0].name}** (Location: ${criticallyDegraded[0].location === 'wha' ? 'Alpha' : 'Beta'}) running at **${criticallyDegraded[0].health}% Health**. High frictional coefficients detected in primary gears.
        <br><br>I have prepared a technician service task and assigned it to **${criticallyDegraded[0].assignedTo}**. Please click below to authorize immediate dispatch.`, [
          { label: `Dispatch technician to ${criticallyDegraded[0].name}`, btnText: "Dispatch Team", action: `triggerServiceDispatch('${criticallyDegraded[0].id}')` }
        ]);
      } else {
        addAgentMessage("bot", "Scanned all assets: All industrial hardware modules running within nominal tolerances. Average machinery health is **100%**.");
      }
    }
    // 4. LOW STOCK / ALERTS DIRECT INQUIRY
    else if (query.includes("low stock") || query.includes("alert") || query.includes("shortfall")) {
      const shortfalls = [];
      STATE.inventory.forEach(item => {
        ["wha", "whb", "whc"].forEach(loc => {
          if (item.stock[loc] < item.threshold) {
            shortfalls.push({ item: item, loc: loc });
          }
        });
      });
      if (shortfalls.length > 0) {
        let details = "Active Stock alerts: <br>";
        shortfalls.forEach((s, idx) => {
          const locName = s.loc === "wha" ? "Alpha" : s.loc === "whb" ? "Beta" : "Gamma";
          details += `${idx+1}. **${s.item.name}** at Warehouse ${locName}: *${s.item.stock[s.loc]}/${s.item.threshold}* units.<br>`;
        });
        addAgentMessage("bot", details + "<br>I recommend drafting replenishment orders or redistributing stock from overstocked Warehouses.");
      } else {
        addAgentMessage("bot", "No active low-stock alerts. All warehouses currently exceed minimum safe thresholds.");
      }
    }
    // FALLBACK CHAT RESPONSE
    else {
      addAgentMessage("bot", `I received your request: "${message}". I can perform the following actions:
      <br><br>1. **Transfer Stock**: E.g. *"Transfer 20 units of Spindle from Alpha to Beta"*
      <br>2. **Predictive Maintenance**: E.g. *"Check machine health"* or *"Dispatch technician"*
      <br>3. **Replenishment Forecasting**: E.g. *"Run procurement demand forecast"* or *"Show stock alerts"*
      <br><br>Please select one of the suggested query chips below or describe your task.`);
    }
  }, 1000);
}
// NLP Parser helper for executing stock transfers
function parseAndExecuteTransfer(query) {
  // Extract number
  const numMatch = query.match(/\b\d+\b/);
  const qty = numMatch ? parseInt(numMatch[0]) : 50;
  // Extract from location
  let fromCode = "wha";
  if (query.includes("beta") || query.includes("austin") || query.includes("whb")) fromCode = "whb";
  else if (query.includes("gamma") || query.includes("seattle") || query.includes("whc")) fromCode = "whc";
  else if (query.includes("alpha") || query.includes("chicago") || query.includes("wha")) fromCode = "wha";
  // Extract to location
  let toCode = "whb";
  if (query.includes("to beta") || query.includes("to austin") || query.includes("to whb")) toCode = "whb";
  else if (query.includes("to gamma") || query.includes("to seattle") || query.includes("to whc")) toCode = "whc";
  else if (query.includes("to alpha") || query.includes("to chicago") || query.includes("to wha")) toCode = "wha";
  // Match item
  let itemIndex = 0; // Default to Spindle
  if (query.includes("sensor")) itemIndex = 1;
  else if (query.includes("bearing")) itemIndex = 2;
  else if (query.includes("valve")) itemIndex = 3;
  else if (query.includes("battery")) itemIndex = 4;
  const item = STATE.inventory[itemIndex];
  if (fromCode === toCode) {
    addAgentMessage("bot", "⚠️ Stock transfer failed. Source and destination warehouses must be different.");
    return;
  }
  // Check if stock exists
  if (item.stock[fromCode] < qty) {
    addAgentMessage("bot", `⚠️ Stock transfer cancelled. Warehouse ${fromCode === 'wha' ? 'Alpha' : fromCode === 'whb' ? 'Beta' : 'Gamma'} only has **${item.stock[fromCode]}** units of *${item.name}*, which is insufficient for a transfer of **${qty}** units.`);
    return;
  }
  // Execute transfer state updates
  executeStockTransfer(itemIndex, qty, fromCode, toCode);
}
function executeStockTransfer(itemIndex, qty, fromCode, toCode) {
  const item = STATE.inventory[itemIndex];
  const fromName = fromCode === "wha" ? "Warehouse Alpha" : fromCode === "whb" ? "Warehouse Beta" : "Warehouse Gamma";
  const toName = toCode === "wha" ? "Warehouse Alpha" : toCode === "whb" ? "Warehouse Beta" : "Warehouse Gamma";
  // Update State - subtract immediately, transit starts
  item.stock[fromCode] -= qty;
  const transitId = `TRN-${Math.floor(1000 + Math.random() * 9000)}`;
  const transitObj = {
    id: transitId,
    item: item.name,
    qty: qty,
    from: fromName,
    to: toName,
    toCode: toCode,
    itemIndex: itemIndex,
    progress: 0,
    eta: 5 // seconds
  };
  STATE.transits.push(transitObj);
  
  logEvent("Logistics", `Cargo manifest ${transitId} generated. Transferring ${qty} units of ${item.name} from ${fromName} to ${toName}.`, "info", "98.8%");
  addAgentMessage("bot", `🚚 Initiated transfer of **${qty} units** of *${item.name}* from **${fromName}** to **${toName}**.
  <br>🚢 Tracking ID: \`${transitId}\`.
  <br>Particle telemetry has been scheduled on the HUD. Expected arrival: 5 seconds.`);
  showToast("Shipment Dispatched", `Cargo tracking ${transitId} loaded.`);
  populateUI();
  // Simulate transit animation with interval
  const transitInterval = setInterval(() => {
    transitObj.progress += 20;
    transitObj.eta -= 1;
    
    // Render transits list
    renderActiveTransits();
    if (transitObj.progress >= 100) {
      clearInterval(transitInterval);
      
      // Add stock to destination
      STATE.inventory[transitObj.itemIndex].stock[transitObj.toCode] += transitObj.qty;
      
      // Remove from active transits
      STATE.transits = STATE.transits.filter(t => t.id !== transitId);
      
      logEvent("Logistics", `Cargo delivery confirmed for manifest ${transitId}. Stock levels incremented at ${toName}.`, "success", "99.9%");
      showToast("Shipment Arrived", `Manifest ${transitId} successfully scanned and stored at ${toName}.`);
      updateTelemetryStats();
      populateShortfallsTable();
      populateInventoryTable();
      renderActiveTransits();
    }
  }, 1000);
}
function renderActiveTransits() {
  const container = document.getElementById("active-transits-container");
  container.innerHTML = "";
  if (STATE.transits.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; font-size:12px; color:var(--text-muted);">No active cargo movements. Logistics channels clear.</div>`;
    return;
  }
  STATE.transits.forEach(t => {
    const box = document.createElement("div");
    box.className = "warehouse-item";
    box.innerHTML = `
      <div class="warehouse-header">
        <span class="warehouse-name" style="color:var(--cyan); font-weight:600;">${t.id} - ${t.item}</span>
        <span class="warehouse-occupancy">${t.progress}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${t.progress}%; background:var(--cyan);"></div>
      </div>
      <div class="warehouse-meta">
        <span>Qty: ${t.qty} | From: ${t.from}</span>
        <span>ETA: ${t.eta}s</span>
      </div>
    `;
    container.appendChild(box);
  });
}
function authorizeAllPOs() {
  STATE.procurementDraftsCount = 0;
  logEvent("Procurement", "Authorised all pending replenishments PO. 2 active purchase orders generated and dispatched.", "success", "99.1%");
  addAgentMessage("bot", "Replenishment purchase orders authorized and successfully dispatched to primary vendors. Tracking tokens generated.");
  showToast("Procurements Dispatched", "2 Replenishment orders sent to supplier networks.");
  populateUI();
}
// Centralized Event Listeners
function setupEventListeners() {
  // Manual Stock transfer submission
  document.getElementById("stock-transfer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const itemIndex = parseInt(document.getElementById("transfer-item").value);
    const qty = parseInt(document.getElementById("transfer-qty").value);
    const fromCode = document.getElementById("transfer-from").value;
    const toCode = document.getElementById("transfer-to").value;
    if (fromCode === toCode) {
      showToast("Transfer Error", "Source and destination warehouses cannot match.", true);
      return;
    }
    const item = STATE.inventory[itemIndex];
    if (item.stock[fromCode] < qty) {
      showToast("Insufficient Stock", `Warehouse only contains ${item.stock[fromCode]} units.`, true);
      return;
    }
    executeStockTransfer(itemIndex, qty, fromCode, toCode);
  });
  // Incident reporting submit
  document.getElementById("asset-issue-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("issue-asset").value;
    const severity = document.getElementById("issue-severity").value;
    const desc = document.getElementById("issue-desc").value || "Manual telemetry override reported.";
    const asset = STATE.assets.find(a => a.id === id);
    if (!asset) return;
    // Mutate asset health depending on severity
    if (severity === "minor") {
      asset.health = Math.max(5, asset.health - 15);
      asset.riskLevel = "Moderate";
    } else if (severity === "moderate") {
      asset.health = Math.max(5, asset.health - 30);
      asset.riskLevel = "Moderate";
    } else {
      asset.health = 20;
      asset.riskLevel = "Critical";
    }
    logEvent("Safety", `Asset Incident Ticket submitted for ${asset.name}. Detail: ${desc}`, "error", "99.9%");
    showToast("Incident Ticket Logged", `Incident logged for ${asset.name} with severity: ${severity.toUpperCase()}`, true);
    
    // Auto trigger agent assistance suggestions
    setTimeout(() => {
      addAgentMessage("bot", `⚠️ **Automated Alert Triggered:** I have received the incident report regarding *${asset.name}*. Current telemetry indicates a health degradation down to **${asset.health}%** (Status: **${asset.riskLevel}**).
      <br><br>Shall I queue preventative service calibration and assign a safety inspector?`, [
        { label: "Dispatch Priority Service", btnText: "Authorize Service", action: `triggerServiceDispatch('${asset.id}')` }
      ]);
    }, 800);
    populateUI();
    document.getElementById("issue-desc").value = "";
  });
  // UI elements: search & filter
  document.getElementById("inventory-search").addEventListener("input", populateInventoryTable);
  document.getElementById("inventory-filter-location").addEventListener("change", populateInventoryTable);
  document.getElementById("log-filter-severity").addEventListener("change", populateLogsMainTable);
  document.getElementById("clear-logs-btn").addEventListener("click", () => {
    STATE.logs = [
      { timestamp: getFormattedTime(), module: "System", details: "Action logs flushed by operations command.", classification: "info", confidence: "100.0%" }
    ];
    showToast("Ledger Cleared", "Audit log database entries deleted.");
    populateLogsMainTable();
    populateUI();
  });
  // Sync data simulator
  document.getElementById("refresh-data-btn").addEventListener("click", () => {
    showToast("Syncing Database", "Connecting to local ERP edge registers...");
    setTimeout(() => {
      showToast("Data Synced", "All warehouse inventory stocks are fully updated.");
      populateUI();
    }, 600);
  });
  // New intervention manual button
  document.getElementById("open-action-btn").addEventListener("click", () => {
    // Scroll and highlight manual ticket section
    // Switch to Assets tab
    document.querySelector(".nav-item[data-tab='assets']").click();
    document.getElementById("issue-desc").focus();
  });
  // Chat submission
  document.getElementById("chat-submit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-message-input");
    const val = input.value.trim();
    if (!val) return;
    handleUserMessage(val);
    input.value = "";
  });
  // Suggested prompts chips
  document.querySelectorAll(".suggested-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const prompt = btn.getAttribute("data-prompt");
      handleUserMessage(prompt);
    });
  });
}
