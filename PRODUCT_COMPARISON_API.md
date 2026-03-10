# Product Comparison API – Use in Another Frontend

This doc describes how to call the product comparison API from your **other frontend** (e.g. shop/customer site) and render the same "Compare this product with similar alternatives" table (Customer reviews with sentiment bars).

---

## 1. API endpoint

**Get a single AI Agent (includes product comparison):**

```http
GET /api/aiagents/:id
```

Example: `GET https://your-backend.com/api/aiagents/5`

Response shape (relevant parts):

```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Boomi Pay-As-You-Go",
    "provider": "Boomi",
    "logo": "https://...",
    "productComparisonContent": {
      "updatedWeekly": true,
      "products": [
        {
          "id": "product_123",
          "name": "Workato Enterprise Automation Platform",
          "provider": "Workato, Inc.",
          "icon": "W",
          "iconColor": "#0066CC",
          "logoUrl": "https://..."
        }
      ],
      "comparisonData": [
        {
          "id": "row_456",
          "category": "Customer reviews",
          "feature": "Reviews",
          "values": {
            "thisProduct": "445 reviews",
            "product_123": "500 reviews"
          }
        },
        {
          "id": "row_789",
          "category": "Customer reviews",
          "feature": "Functionality",
          "values": {
            "thisProduct": "Positive",
            "product_123": "Positive"
          }
        }
      ],
      "categoryDescriptions": {
        "Customer reviews": "Sentiment is AI generated from actual customer reviews on AWS and G2."
      }
    }
  }
}
```

---

## 2. Data shape (for rendering)

| Field | Type | Meaning |
|-------|------|--------|
| `agent` | object | The AI Agent (this product). Use `agent.name`, `agent.provider`, `agent.logo`. |
| `productComparisonContent.updatedWeekly` | boolean | Show "Updated weekly" when true. |
| `productComparisonContent.products` | array | Competitor products. Each has `id`, `name`, `provider`, `icon`, `iconColor`, `logoUrl`. |
| `productComparisonContent.comparisonData` | array | Rows to show. Each has `id`, `category`, `feature`, `values`. |
| `productComparisonContent.categoryDescriptions` | object | Map category name → description (e.g. "Sentiment is AI generated..."). |

**`values` in each row:**

- `values.thisProduct` = value for the main product (the agent).
- `values.product_<id>` = value for competitor with that `id`.

**Sentiment values:** If the cell value is a string containing `"positive"`, `"mixed"`, or `"negative"`, show:

- Label: `↑` + value for positive, `↓` + value for mixed/negative.
- A horizontal bar: green for positive, grey for mixed, red for negative (e.g. width by sentiment: positive 85%, mixed 50%, negative 20%).

---

## 3. How to render the table

1. **Columns:** One column for the agent ("This product") + one per `productComparisonContent.products`. Header per column: logo (or icon+color), name, "By {provider}".
2. **Group by category:** Loop over `comparisonData` grouped by `category`. For each category:
   - One header row: category name + optional `categoryDescriptions[category]` (e.g. "Sentiment is AI generated...").
   - One data row per `feature` in that category.
3. **Each cell:** Use `row.values.thisProduct` or `row.values['product_' + product.id]`.
   - If value contains "positive"/"mixed"/"negative": show "↑ value" or "↓ value" and the sentiment bar.
   - Otherwise show plain text (e.g. "445 reviews").

---

## 4. Example fetch (React)

```javascript
// Fetch agent with product comparison
const response = await fetch(`${API_BASE}/api/aiagents/${agentId}`);
const json = await response.json();
if (!json.success) throw new Error(json.error || 'Failed to load');
const agent = json.data;
const pc = agent.productComparisonContent || {};

const products = pc.products || [];
const comparisonData = pc.comparisonData || [];
const categoryDescriptions = pc.categoryDescriptions || {};

// Group rows by category
const grouped = {};
comparisonData.forEach((row) => {
  const cat = row.category || 'General';
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(row);
});

// Render: table with thead (agent + products), tbody (for each category: header row then one row per feature)
// For each cell value, if it's a sentiment string show ↑/↓ + bar; else show text.
```

---

## 5. Prompt for another frontend

**Product comparison block (prompt):**

We need a "Compare this product with similar alternatives" section on the product/agent detail page.

- **API:** `GET /api/aiagents/:id`. Response has `data.productComparisonContent` with:
  - `products`: array of competitors (`id`, `name`, `provider`, `icon`, `iconColor`, `logoUrl`).
  - `comparisonData`: array of rows (`id`, `category`, `feature`, `values`). `values` has `thisProduct` and `product_<id>` per competitor.
  - `categoryDescriptions`: object mapping category name to description.

- **UI:** Table with:
  - Header row: empty cell, then "This product" (agent logo/name/By provider), then one column per competitor (logo/name/By provider).
  - Body: group rows by `category`. For each category, one subheader row with category name and optional description from `categoryDescriptions`, then one row per `feature` with one cell per column (agent + competitors). Cell content from `row.values.thisProduct` and `row.values['product_' + product.id]`.
  - If a cell value contains "positive", "mixed", or "negative", show "↑" or "↓" plus the text and a small horizontal bar (green/grey/red). Otherwise show the text as-is (e.g. "445 reviews").

- **Empty state:** If `products` and `comparisonData` are both empty, show "No comparison data" or hide the section.

---

## 6. Optional: public endpoint

If your other frontend is on another domain and only needs to show comparison (no auth):

- CORS allows that frontend's origin.
- Either use the same `GET /api/aiagents/:id` or add a public route (e.g. `GET /api/public/aiagents/:id`) that returns the same agent + `productComparisonContent` without sensitive fields.
