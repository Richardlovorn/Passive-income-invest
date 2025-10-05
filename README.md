k# Real Income Stream Generator - Automated Trading System

## ⚠️ CRITICAL WARNING

**This application connects to REAL brokerage accounts and executes REAL trades with REAL money. You can LOSE all your invested capital. Use at your own risk.**

## Overview

This is a sophisticated automated trading system that connects to your Alpaca brokerage account to:
- Execute algorithmic trading strategies
- Generate income through automated trading
- Distribute profits automatically to your bank account
- Monitor and manage positions in real-time

## Features

### 🤖 Automated Trading
- Multiple trading strategies (Moving Average, RSI, Mean Reversion, Momentum)
- Real-time market analysis
- Automatic order execution
- Risk management controls

### 💰 Profit Distribution
- Automatic profit calculation
- Configurable distribution percentage (default 50%)
- Direct bank account transfers
- Retained profits for compound growth

### 📊 Portfolio Management
- Real-time position monitoring
- P&L tracking
- Order management
- Emergency stop functionality

### 🛡️ Safety Features
- Paper trading mode for testing
- Risk limits and position sizing
- Stop loss and take profit orders
- Maximum daily loss limits
- Emergency stop button

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Alpaca brokerage account
- Bank account for profit distribution

### 2. Get Alpaca API Keys
1. Sign up at https://alpaca.markets/
2. Navigate to your dashboard
3. Generate API keys (use paper trading keys first!)
4. Note your API Key ID and Secret Key

### 3. Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd [your-repo-name]

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your Alpaca API keys
# IMPORTANT: Start with paper trading (VITE_ALPACA_PAPER=true)
```

### 4. Configuration
Edit `.env` file:
```env
VITE_ALPACA_API_KEY=your_api_key_here
VITE_ALPACA_SECRET_KEY=your_secret_key_here
VITE_ALPACA_PAPER=true  # Use paper trading first!
```

### 5. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

## Usage Guide

### First Time Setup
1. **Start with Paper Trading**: Always test with paper trading first
2. **Configure Settings**: Set risk parameters, position sizes, and strategies
3. **Set Profit Distribution**: Configure bank account and distribution percentage
4. **Monitor Performance**: Watch the bot trade in paper mode
5. **Go Live**: Only switch to live trading after successful paper trading

### Trading Settings
- **Max Position Size**: Maximum $ per trade
- **Max Daily Loss**: Stop trading if daily loss exceeds this
- **Max Open Positions**: Limit concurrent positions
- **Risk Level**: Conservative, Moderate, or Aggressive
- **Stop Loss %**: Automatic stop loss percentage
- **Take Profit %**: Automatic profit taking percentage

### Profit Distribution
- **Default**: 50% of profits to bank, 50% retained
- **Customizable**: Adjust percentage as needed
- **Minimum Withdrawal**: Set minimum amount for transfers
- **Automatic**: Profits transferred based on schedule

## Trading Strategies

### 1. Moving Average Crossover
- Buys when short MA crosses above long MA
- Sells when short MA crosses below long MA

### 2. RSI (Relative Strength Index)
- Buys when RSI < 30 (oversold)
- Sells when RSI > 70 (overbought)

### 3. Mean Reversion
- Buys when price is significantly below mean
- Sells when price is significantly above mean

### 4. Momentum Trading
- Follows strong price movements
- Enters positions in direction of momentum

## Risk Warnings

### ⚠️ Important Risks
- **Capital Loss**: You can lose all invested money
- **Technical Failures**: System crashes can cause losses
- **Market Volatility**: Sudden market moves can trigger losses
- **Execution Risk**: Orders may not fill at expected prices
- **Regulatory Risk**: Trading regulations may change

### 📋 Best Practices
1. Start with paper trading
2. Use small position sizes initially
3. Set strict risk limits
4. Monitor the system regularly
5. Have an emergency plan
6. Keep API keys secure
7. Regularly review performance
8. Adjust strategies based on results

## Support

For issues or questions:
- Review Alpaca documentation: https://docs.alpaca.markets/
- Check system logs for errors
- Test in paper trading mode
- Reduce position sizes if experiencing losses

## Disclaimer

This software is provided "as is" without warranty. The authors are not responsible for any financial losses incurred through use of this system. Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results.

## License

[Your License Here]

---


**Remember**: Always start with paper trading and never invest more than you can afford to lose!