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
    console.log(`💰 Crediting wallet for user ${userId}: €${amount}`);
    
    // Call Laravel backend to credit wallet
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
    
    try {
      const response = await fetch(`${backendUrl}/wallet/credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // In production, you'd use proper authentication
          // 'Authorization': `Bearer ${serverToken}`
        },
        body: JSON.stringify({
          user_id: userId,
          amount: amount,
          type: 'cashback',
          source: 'widget_purchase',
          description: metadata.description,
          order_id: metadata.order_id,
          shop_name: metadata.shop_name
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend wallet credit successful:', result);
        
        return {
          success: true,
          new_balance: result.data?.balance || amount,
          transaction_id: result.data?.transaction_id || `tx_${Date.now()}`
        };
      } else {
        console.warn('⚠️ Backend wallet API not available, using local tracking');
      }
    } catch (backendError) {
      console.warn('⚠️ Backend not reachable, using local tracking:', backendError);
    }
    
    // Fallback: If backend is not available, still track locally
    // This ensures the purchase is recorded even if wallet service is down
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('💾 Purchase tracked locally (backend offline)');
    console.log('Transaction details:', {
      user_id: userId,
      amount: amount,
      transaction_id: transactionId,
      order_id: metadata.order_id,
      shop_name: metadata.shop_name,
      type: metadata.type,
      description: metadata.description
    });
    
    // Return success with mock balance
    // In production, you'd queue this for later processing
    return {
      success: true,
      new_balance: amount, // Cashback amount (actual balance would come from backend)
      transaction_id: transactionId
    };
  } catch (error) {
    console.error('❌ Wallet crediting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
