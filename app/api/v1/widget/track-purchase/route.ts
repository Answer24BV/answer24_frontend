import { NextRequest, NextResponse } from 'next/server';
import { WIDGET_CONFIG } from '@/lib/widget-config';

/**
 * Track purchase and credit user wallet
 * This endpoint is called when a user makes a purchase through the widget
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      order_value, 
      order_id, 
      shop_name, 
      public_key,
      timestamp,
      signature 
    } = body;

    // Validate required fields
    if (!user_id || !order_value || !order_id || !public_key) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate signature for security
    if (!validatePurchaseSignature(body, WIDGET_CONFIG.SIGNING_SECRET)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Calculate cashback amount (10% of order value)
    const cashbackAmount = Math.round(order_value * 0.1 * 100) / 100; // Round to 2 decimal places

    // Create purchase record
    const purchaseRecord = {
      user_id,
      order_id,
      order_value,
      cashback_amount: cashbackAmount,
      shop_name,
      public_key,
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending'
    };

    // TODO: Save to database
    console.log('📊 Purchase tracked:', purchaseRecord);

    // Credit user wallet
    const walletCredit = await creditUserWallet(user_id, cashbackAmount, {
      type: 'cashback',
      source: 'widget_purchase',
      order_id,
      shop_name,
      description: `Cashback from ${shop_name} purchase`
    });

    if (walletCredit.success) {
      // Update purchase record status
      purchaseRecord.status = 'credited';
      
      // TODO: Update database record
      console.log('💰 Wallet credited:', walletCredit);

      return NextResponse.json({
        success: true,
        message: 'Purchase tracked and wallet credited',
        data: {
          purchase_id: purchaseRecord.order_id,
          cashback_amount: cashbackAmount,
          wallet_balance: walletCredit.new_balance,
          transaction_id: walletCredit.transaction_id
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to credit wallet', details: walletCredit.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Purchase tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate purchase signature for security
 */
function validatePurchaseSignature(data: any, secret: string): boolean {
  try {
    const { signature, ...payload } = data;
    const expectedSignature = generatePurchaseSignature(payload, secret);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

/**
 * Generate signature for purchase data
 */
function generatePurchaseSignature(data: any, secret: string): string {
  const payload = JSON.stringify(data);
  const crypto = require('crypto');
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Credit user wallet with cashback
 */
async function creditUserWallet(
  userId: string, 
  amount: number, 
  metadata: any
): Promise<{ success: boolean; new_balance?: number; transaction_id?: string; error?: string }> {
  try {
    // TODO: Implement actual wallet crediting logic
    // This would typically involve:
    // 1. Fetch current wallet balance
    // 2. Add cashback amount
    // 3. Create transaction record
    // 4. Update wallet balance
    // 5. Send notification to user

    console.log(`💰 Crediting wallet for user ${userId}: €${amount}`);
    
    // Mock implementation - replace with actual wallet service
    const mockResult = {
      success: true,
      new_balance: 125.50, // Mock balance
      transaction_id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return mockResult;
  } catch (error) {
    console.error('❌ Wallet crediting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
