// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  options: {
    // Appearance customization for Stripe Elements
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#df2020',
        colorBackground: '#ffffff',
        colorText: '#111A45',
        colorDanger: '#df453e',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Label': {
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '8px',
        },
        '.Input': {
          padding: '12px',
          fontSize: '15px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
        '.Input:focus': {
          boxShadow: '0 0 0 3px rgba(223, 32, 32, 0.1)',
          borderColor: '#df2020',
        },
      },
    },
  },
};

export default STRIPE_CONFIG;

