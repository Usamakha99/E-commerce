# Marketplace Product Detail – Optimization Guide

This page was refactored to use extracted components. Use this guide to continue splitting the remaining sections.

## Current structure

- **`src/components/marketplace/`**
  - **MarketplaceTabsNav.jsx** – Sticky tab bar (Overview, Features, Resources, Support, Product comparison, How to buy). Uses `TABS` constant; export from `index.js` if the page needs it.
  - **MarketplaceProductDetailHeader.jsx** – Product logo, title, short description (show more/less), and action buttons (View Purchase Options, Try for Free, Request Demo).
  - **index.js** – Re-exports the above.

- **`src/pages/MarketplaceProductDetail.jsx`** – Still contains:
  - All state and data fetching (agent, product mapping, categories, inquiry form state).
  - `mapAgentToProduct`-style logic (large block; can move to `src/utils/mapAgentToProduct.js`).
  - Tab content: Overview, Features, Resources, Support, **Product comparison**, **Pricing** (How to buy).

## How to optimize further

### 1. Extract data layer

- **`src/utils/mapAgentToProduct.js`**  
  Move the `product = agent ? (() => { ... })() : { ... }` block into a pure function `mapAgentToProduct(agent)` and call it from the page (or from a hook). Makes the page thinner and the mapping testable.

- **`src/hooks/useMarketplaceAgent.js`**  
  Create a hook that:
  - Takes `id` (from route).
  - Fetches agent (`aiAgentService.getAgentById(id)`), fetches categories (`getCategoriesWithCounts`).
  - Computes `product = mapAgentToProduct(agent)`.
  - Returns `{ agent, product, categories, loading, error }`.  
  Optionally also handle `setDocumentTitle` and scroll-spy for `activeTab` inside the hook or in the page.

### 2. Extract tab sections into components

Each block below can become its own component under `src/components/marketplace/` and receive `product`, `agent`, `isMobile`, `isTablet` (and any callbacks) as props.

| Section            | Suggested component                    | Location in page (approx.) |
|--------------------|----------------------------------------|----------------------------|
| Overview           | `MarketplaceOverviewTab.jsx`           | `#overview`                |
| Features           | `MarketplaceFeaturesTab.jsx`           | `#features`                |
| Resources          | `MarketplaceResourcesTab.jsx`          | `#resources`               |
| Support            | `MarketplaceSupportTab.jsx`            | `#support`                 |
| Product comparison | `MarketplaceProductComparison.jsx`     | `#product-comparison`      |
| Pricing / How to buy | `MarketplacePricingSection.jsx`     | `#how-to-buy`              |

- **Shared helpers**  
  Move `renderTextWithLinks` and `renderStars` into something like `src/utils/marketplaceUtils.js` or keep in the page and pass as props until you have more components using them.

### 3. Keep the page thin

After extractions, `MarketplaceProductDetail.jsx` should:

- Use `useMarketplaceAgent(id)` (and maybe local state for inquiry modal + form).
- Render loading/error states.
- Render `<MarketplaceProductDetailHeader ... />` and `<MarketplaceTabsNav ... />`.
- Render one container that includes all tab sections (Overview, Features, Resources, Support, Product comparison, Pricing) as components.
- Render `<ProductInquiryModal ... />`.

### 4. Naming and props

- Use a consistent prop set for tab components, e.g. `product`, `agent`, `isMobile`, `isTablet`, and section-specific props (e.g. `onOpenInquiryModal` for Pricing).
- Keep section ids (`overview`, `features`, etc.) so sticky nav and scroll-spy still work.

### 5. Testing

- `mapAgentToProduct` can be unit-tested with a stub `agent`.
- Each tab component can be tested in isolation by passing stub `product` / `agent`.

---

**Summary:** Header and TabsNav are already extracted. Next steps: extract `mapAgentToProduct` and `useMarketplaceAgent`, then extract each tab section into the components listed above so the page becomes a thin orchestrator.
