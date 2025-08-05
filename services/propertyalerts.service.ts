// services/propertyalerts.service.ts
export interface propertyAlertDataRes {
  id: string;
  message: string;
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
  };
  createdAt: string;
}

export const getPropertyAlerts = async (
  token: string,
  page: number = 1,
  pageSize: number = 10
): Promise<propertyAlertDataRes[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.answer24.nl/api/v1";
    const response = await fetch(`${baseUrl}/property-alerts?page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch property alerts.");
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching property alerts:", error);
    // Return mock data for demonstration
    return [
      {
        id: "alert-1",
        message: "Price dropped by 10%",
        property: {
          id: "prop-1",
          title: "Beautiful Family Home",
          address: "123 Main Street, Amsterdam",
          price: 450000,
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: "alert-2",
        message: "New property matching your criteria",
        property: {
          id: "prop-2",
          title: "Modern Apartment",
          address: "456 Canal Street, Utrecht",
          price: 320000,
        },
        createdAt: new Date().toISOString(),
      },
    ];
  }
};