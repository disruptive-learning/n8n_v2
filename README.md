# n8n-nodes-gigstack

![npm](https://img.shields.io/npm/v/@disruptive-learning/n8n-nodes-gigstack)
![license](https://img.shields.io/npm/l/@disruptive-learning/n8n-nodes-gigstack)
![n8n](https://img.shields.io/badge/n8n-community--node-orange)

**n8n community node for [Gigstack](https://gigstack.io)** - Mexican tax compliance, invoicing (CFDI 4.0), and payment processing.

Automate your Mexican billing workflows with SAT-compliant invoices, receipts, payments, and more.

---

## Installation

### In n8n (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Enter `@disruptive-learning/n8n-nodes-gigstack`
3. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/custom
npm install @disruptive-learning/n8n-nodes-gigstack
```

### Docker

```dockerfile
RUN cd /home/node/.n8n/custom && npm install @disruptive-learning/n8n-nodes-gigstack
```

---

## Features

| Resource | Operations |
|----------|------------|
| **Clients** | Create, Get, Get All, Update, Delete, Validate (SAT), Customer Portal, Stamp Pending Receipts |
| **Invoices** | Create Income (CFDI I), Create Egress (CFDI E), Get, Get All, Cancel, Get Files (PDF/XML) |
| **Payments** | Request, Register, Get, Get All, Cancel, Mark as Paid, Refund |
| **Receipts** | Create, Get, Get All, Cancel, Stamp (convert to CFDI) |
| **Services** | Create, Get, Get All, Update, Delete |
| **Teams** | Create, Get, Get All, Update, Add/Remove Members, Series Management, Settings |
| **Users** | Create, Get, Get All, Update, Reset Password, Login Link |
| **Webhooks** | Create, Get, Get All, Update, Delete |

### Trigger Node

Listen for real-time events:
- `invoice.created`, `invoice.cancelled`
- `payment.completed`, `payment.failed`
- `receipt.stamped`
- And more...

---

## Credentials

1. Get your API key from [Gigstack Dashboard](https://app.gigstack.io/settings/api)
2. In n8n, go to **Credentials** > **New Credential**
3. Search for **Gigstack API**
4. Enter your API key
5. Select environment: **Production** or **Sandbox**

---

## Usage Examples

### Create a Client

```json
{
  "email": "cliente@empresa.mx",
  "name": "Juan Perez",
  "legal_name": "Juan Perez Garcia",
  "tax_id": "PEGJ850101ABC",
  "tax_system": "612",
  "zip": "06600"
}
```

### Create an Invoice (CFDI)

```json
{
  "clientId": "client_abc123",
  "items": [
    {
      "description": "Servicio de consultoría",
      "quantity": 1,
      "unit_price": 5000,
      "product_key": "80141503",
      "unit_key": "E48"
    }
  ],
  "payment_method": "PUE",
  "payment_form": "03",
  "use": "G03"
}
```

### Request Payment

```json
{
  "clientId": "client_abc123",
  "amount": 5800,
  "currency": "MXN",
  "description": "Payment for consulting services"
}
```

---

## SAT Compliance

This node supports **CFDI 4.0** Mexican tax requirements:

- **Tax Regimes** (Regimen Fiscal): 601, 603, 605, 606, 612, 616, 621, 625, 626
- **CFDI Uses** (Uso de CFDI): G01, G02, G03, P01, S01, and more
- **Payment Methods**: PUE (single payment), PPD (partial/deferred)
- **Payment Forms**: Cash, Transfer, Credit Card, etc. (01-99)
- **Cancellation Motives**: 01, 02, 03, 04

---

## Multi-Team Support (Gigstack Connect)

For Gigstack Connect users managing multiple teams:

1. Add the **Team ID** field in any operation
2. Leave empty to use your default team
3. Specify a team ID to operate on behalf of that team

---

## Development

```bash
# Clone the repository
git clone https://github.com/gigstack/n8n-nodes-gigstack.git
cd n8n-nodes-gigstack

# Install dependencies
npm install

# Build
npm run build

# Sync with Gigstack API (check for updates)
npm run sync-swagger

# Link for local testing
npm link
cd ~/.n8n/custom && npm link @disruptive-learning/n8n-nodes-gigstack
```

---

## Resources

- [Gigstack Website](https://gigstack.io)
- [Gigstack API Documentation](https://docs.gigstack.io)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Report Issues](https://github.com/gigstack/n8n-nodes-gigstack/issues)

---

## License

[MIT](LICENSE) - Built with love by [Gigstack](https://gigstack.io) and [Disruptive Learning](https://github.com/disruptive-learning)
