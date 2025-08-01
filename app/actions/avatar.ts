'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL = 'https://staging.answer24.nl/api/v1';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type Avatar = {
  id: string;
  name: string;
  role: string;
  description: string;
  functions: string[];
  image: string;
  required_plan: 'small' | 'medium' | 'big';
  created_at: string;
  updated_at: string;
};

export async function getAvatars(): Promise<Avatar[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/avatar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure we always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch avatars: ${response.statusText}`);
    }

    const result: ApiResponse<Avatar[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch avatars');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching avatars:', error);
    throw error;
  }
}

export async function getAvatarById(id: string): Promise<Avatar | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/avatar/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.statusText}`);
    }

    const result: ApiResponse<Avatar> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch avatar');
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching avatar with id ${id}:`, error);
    throw error;
  }
}

export async function createAvatar(avatarData: Omit<Avatar, 'id' | 'created_at' | 'updated_at'>): Promise<Avatar> {
  try {
    const response = await fetch(`${API_BASE_URL}/avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create avatar: ${response.statusText}`);
    }

    const result: ApiResponse<Avatar> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create avatar');
    }

    revalidatePath('/client/avatar');
    return result.data;
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw error;
  }
}

export async function updateAvatar(
  id: string, 
  avatarData: Partial<Omit<Avatar, 'id' | 'created_at' | 'updated_at'>>
): Promise<Avatar> {
  try {
    const response = await fetch(`${API_BASE_URL}/avatar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update avatar: ${response.statusText}`);
    }

    const result: ApiResponse<Avatar> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update avatar');
    }

    revalidatePath('/client/avatar');
    return result.data;
  } catch (error) {
    console.error(`Error updating avatar with id ${id}:`, error);
    throw error;
  }
}

export async function deleteAvatar(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/avatar/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error(`Failed to delete avatar: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete avatar');
    }

    revalidatePath('/client/avatar');
    return true;
  } catch (error) {
    console.error(`Error deleting avatar with id ${id}:`, error);
    throw error;
  }
}
