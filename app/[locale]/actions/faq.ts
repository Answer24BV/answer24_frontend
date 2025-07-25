// Demo data for FAQ
const faqData = [
  {
    id: 'general',
    name: 'General',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all products. Items must be in their original condition with tags attached.'
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can track your order using this number on our website.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account',
    items: [
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
      },
      {
        question: 'How do I update my account information?',
        answer: 'You can update your account information in the "My Account" section after logging in.'
      }
    ]
  },
  {
    id: 'shipping',
    name: 'Shipping',
    items: [
      {
        question: 'What are your shipping options?',
        answer: 'We offer standard (3-5 business days) and express (1-2 business days) shipping options.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
      }
    ]
  }
];

// Simulate an async API call
export async function getFAQs() {
  // In a real app, this would be a fetch call to your API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(faqData);
    }, 500);
  });
}

export type FAQCategory = typeof faqData[0];
export type FAQItem = FAQCategory['items'][0];
