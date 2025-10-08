import { NextRequest, NextResponse } from 'next/server';

interface WidgetSettings {
  id: string;
  company_id: string;
  // Appearance
  primary_color: string;
  secondary_color: string;
  text_color: string;
  background_color: string;
  border_radius: number;
  // Branding
  company_name: string;
  company_logo: string;
  welcome_message: string;
  placeholder_text: string;
  // Behavior
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  auto_open: boolean;
  show_typing_indicator: boolean;
  // AI Settings
  ai_personality: string;
  ai_temperature: number;
  max_tokens: number;
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Mock database - in production, use your actual database
const mockSettings: Record<string, WidgetSettings> = {
  '123': {
    id: '1',
    company_id: '123',
    primary_color: '#007bff',
    secondary_color: '#6c757d',
    text_color: '#ffffff',
    background_color: '#ffffff',
    border_radius: 12,
    company_name: 'Demo Shop',
    company_logo: 'https://via.placeholder.com/50x50/007bff/ffffff?text=DS',
    welcome_message: 'Hi! Welcome to Demo Shop. How can I help you today?',
    placeholder_text: 'Type your message...',
    position: 'bottom-right',
    auto_open: false,
    show_typing_indicator: true,
    ai_personality: 'friendly and helpful sales assistant',
    ai_temperature: 0.7,
    max_tokens: 500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get settings for this company
    const settings = mockSettings[companyId];
    
    if (!settings) {
      // Return default settings if company not found
      const defaultSettings: WidgetSettings = {
        id: 'default',
        company_id: companyId,
        primary_color: '#007bff',
        secondary_color: '#6c757d',
        text_color: '#ffffff',
        background_color: '#ffffff',
        border_radius: 12,
        company_name: 'Your Company',
        company_logo: '',
        welcome_message: 'Hi! How can I help you today?',
        placeholder_text: 'Type your message...',
        position: 'bottom-right',
        auto_open: false,
        show_typing_indicator: true,
        ai_personality: 'friendly and helpful assistant',
        ai_temperature: 0.7,
        max_tokens: 500,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return NextResponse.json({ settings: defaultSettings });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Widget Settings GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget settings' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const updates = await request.json();
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get current settings
    const currentSettings = mockSettings[companyId] || {
      id: 'new',
      company_id: companyId,
      primary_color: '#007bff',
      secondary_color: '#6c757d',
      text_color: '#ffffff',
      background_color: '#ffffff',
      border_radius: 12,
      company_name: 'Your Company',
      company_logo: '',
      welcome_message: 'Hi! How can I help you today?',
      placeholder_text: 'Type your message...',
      position: 'bottom-right' as const,
      auto_open: false,
      show_typing_indicator: true,
      ai_personality: 'friendly and helpful assistant',
      ai_temperature: 0.7,
      max_tokens: 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update settings
    const updatedSettings: WidgetSettings = {
      ...currentSettings,
      ...updates,
      company_id: companyId,
      updated_at: new Date().toISOString(),
    };

    // Save to mock database
    mockSettings[companyId] = updatedSettings;

    return NextResponse.json({ 
      settings: updatedSettings,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Widget Settings POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to update widget settings' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  // Same as POST for full update
  return POST(request, { params });
}
