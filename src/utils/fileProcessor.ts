import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from "xlsx";
import { Invoice, Product, Customer, ValidationError } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function processFile(file: File) {
  const fileType = file.type;
  let extractedData;

  try {
    if (fileType.includes("pdf")) {
      extractedData = await processPDF(file);
    } else if (
      fileType.includes("excel") ||
      fileType.includes("spreadsheet") ||
      fileType.includes("csv")
    ) {
      extractedData = await processExcel(file);
    } else if (fileType.includes("image")) {
      extractedData = await processImage(file);
    } else {
      throw new Error("Unsupported file type");
    }

    const validationErrors = validateData(extractedData);
    const organizedData = organizeData(extractedData);

    return {
      ...organizedData,
      validationErrors,
    };
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}

async function processPDF(file: File) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Convert file to base64
  const fileData = await file.arrayBuffer();
  const base64Data = btoa(
    new Uint8Array(fileData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please analyze this invoice and extract ALL information in the following detailed JSON format:
{
  "invoice_number": "",
  "date": "",
  "invoice_type": "",
  "place_of_supply": "",
  "customer_details": {
    "name": "",
    "phone": "",
    "email": "",
    "address": "",
    "gst_number": "",
    "type": ""
  },
  "business_details": {
    "name": "",
    "gstin": "",
    "address": {
      "street": "",
      "city": "",
      "state": "",
      "pincode": ""
    },
    "contact": {
      "mobile": "",
      "email": ""
    }
  },
  "products_services": [
    {
      "sl_no": "",
      "description": "",
      "hsn_code": "",
      "quantity": 0,
      "rate": 0,
      "taxable_value": 0,
      "gst_percentage": 0,
      "gst_amount": 0,
      "amount": 0
    }
  ],
  "additional_charges": [
    {
      "description": "",
      "amount": 0
    }
  ],
  "summary": {
    "total_taxable_amount": 0,
    "total_gst_amount": 0,
    "total_amount": 0,
    "total_items": 0,
    "total_quantity": 0
  },
  "tax_details": {
    "igst_percentage": 0,
    "igst_amount": 0,
    "cgst_percentage": 0,
    "cgst_amount": 0,
    "sgst_percentage": 0,
    "sgst_amount": 0
  },
  "payment_details": {
    "making_charges": 0,
    "debit_card_charges": 0,
    "shipping_charges": 0
  }
}`,
          },
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
        ],
      },
    ],
  });

  const result = await response.response;
  const cleanedText = result
    .text()
    .replace(/```json\n|\n```/g, "")
    .trim();
  console.log(cleanedText);
  return JSON.parse(cleanedText);
}

async function processExcel(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Create a single data object with the required format
        const formattedData = {
          invoice_number: jsonData[0]?.["Serial Number"],
          date: jsonData[0]?.["Date"],
          business_details: {
            name: "Swipe Demo", // Using the Creator field from your Excel
            address: "",
            gst_number: "",
            contact: "",
          },
          customer_details: {
            name: jsonData[0]?.["Party Name"],
            phone: "",
            email: "",
            address: "",
          },
          products_services: jsonData.map((row: any) => ({
            description: row["Party Name"],
            quantity: 1,
            rate: parseFloat(row["Net Amount"]) || 0,
            amount: parseFloat(row["Total Amount"]) || 0,
            tax: parseFloat(row["Tax Amount"]) || 0,
          })),
          total: parseFloat(jsonData[0]?.["Total Amount"]) || 0,
        };

        resolve(formattedData);
      } catch (error) {
        console.error("Excel processing error:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

async function processImage(file: File) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Convert file to base64
  const fileData = await file.arrayBuffer();
  const base64Data = btoa(
    new Uint8Array(fileData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please analyze this invoice and extract the information in the following JSON format:
{
  "invoice_number": "",
  "date": "",
  "customer_details": {
    "name": "",
    "phone": "",
    "email": "",
    "address": "",
    "gst_number": ""
  },
  "business_details": {
    "name": "",
    "address": "",
    "gst_number": "",
    "contact": ""
  },
  "products_services": [
    {
      "description": "",
      "quantity": 0,
      "rate": 0,
      "amount": 0,
      "discount_percentage": 0,
      "discount_amount": 0
    }
  ],
  "total": 0,
  "tax_details": {
    "igst_percentage": 0,
    "igst_amount": 0,
    "cgst_percentage": 0,
    "cgst_amount": 0,
    "sgst_percentage": 0,
    "sgst_amount": 0
  }
}`,
          },
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
        ],
      },
    ],
  });

  const result = await response.response;
  const cleanedText = result
    .text()
    .replace(/```json\n|\n```/g, "")
    .trim();
  console.log(cleanedText);
  return JSON.parse(cleanedText);
}

function validateData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data) {
    errors.push({ field: "data", message: "No data provided" });
    return errors;
  }

  // Validate invoice number and date
  if (!data.invoice_number) {
    errors.push({
      field: "invoice_number",
      message: "Invoice number is required",
    });
  }
  if (!data.date) {
    errors.push({ field: "date", message: "Date is required" });
  }

  // Validate business details
  if (!data.business_details?.name) {
    errors.push({
      field: "business_details.name",
      message: "Business name is required",
    });
  }

  // Validate customer details
  if (!data.customer_details?.name) {
    errors.push({
      field: "customer_details.name",
      message: "Customer name is required",
    });
  }

  // Validate products
  if (
    !data.products_services ||
    !Array.isArray(data.products_services) ||
    data.products_services.length === 0
  ) {
    errors.push({
      field: "products_services",
      message: "At least one product is required",
    });
  } else {
    data.products_services.forEach((product: any, index: number) => {
      if (!product.description) {
        errors.push({
          field: `products_services[${index}].description`,
          message: "Product description is required",
        });
      }
      if (!product.quantity) {
        errors.push({
          field: `products_services[${index}].quantity`,
          message: "Product quantity is required",
        });
      }
      if (!product.amount && product.rate && product.quantity) {
        product.amount = product.rate * product.quantity;
      }
      if (!product.amount && !product.rate) {
        errors.push({
          field: `products_services[${index}].amount`,
          message: "Product amount or rate is required",
        });
      }
    });
  }

  return errors;
}

function organizeData(data: any) {
  const invoices: Invoice[] = [];
  const products: Product[] = [];
  const customers: Customer[] = [];

  try {
    // Helper function to parse monetary values
    const parseAmount = (value: any): number => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
      }
      return 0;
    };

    // Process invoice and its products
    if (data.products_services && Array.isArray(data.products_services)) {
      data.products_services.forEach((product: any) => {
        // Create invoice entry
        invoices.push({
          id: crypto.randomUUID(),
          serialNumber: data.invoice_number || "",
          customerName: data.customer_details?.name || "",
          customerGst: data.customer_details?.gst_number || "",
          productName: product.description || "",
          quantity: parseFloat(product.quantity) || 0,
          tax: parseAmount(product.tax || data.tax_details?.igst_amount),
          totalAmount: parseAmount(product.amount),
          date: data.date || new Date().toISOString(),
          discount: parseAmount(product.discount_amount),
          businessDetails: data.business_details,
          taxDetails: data.tax_details,
        });

        // Add to products array
        products.push({
          id: crypto.randomUUID(),
          name: product.description || "",
          quantity: parseFloat(product.quantity) || 0,
          unitPrice: parseAmount(product.rate),
          tax: parseAmount(product.tax || data.tax_details?.igst_amount),
          priceWithTax: parseAmount(product.amount),
          discount: parseAmount(product.discount_amount),
          discountPercentage: parseAmount(product.discount_percentage),
        });
      });
    }

    // Process customer
    if (data.customer_details) {
      customers.push({
        id: crypto.randomUUID(),
        name: data.customer_details.name || "",
        phoneNumber: data.customer_details.phone || "",
        totalPurchaseAmount: parseAmount(data.total),
        email: data.customer_details.email || "",
        address: data.customer_details.address || "",
        gstNumber: data.customer_details.gst_number || "",
      });
    }

    console.log("Organized data:", { invoices, products, customers });
  } catch (error) {
    console.error("Error organizing data:", error);
    throw error;
  }

  return { invoices, products, customers };
}

async function processDocument(file: File) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Convert file to base64
  const fileData = await file.arrayBuffer();
  const base64Data = btoa(
    new Uint8Array(fileData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Please analyze this invoice document and extract all available information in a structured JSON format. Follow these guidelines:

1. Identify and extract all key-value pairs present in the document
2. For any tabular data, preserve the structure and all columns
3. Capture all monetary values, quantities, and calculations
4. Include any metadata, headers, footers, and additional notes
5. Maintain original labels/keys as found in the document
6. Group related information logically (e.g., business details, customer details, product details)
7. Preserve any tax-related information with their original labels
8. Capture all dates, reference numbers, and identifiers
9. Include any terms, conditions, or special instructions
10. Extract contact information, addresses, and registration numbers

Format the response as a nested JSON object, creating appropriate groupings based on the document's structure.`,
          },
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
        ],
      },
    ],
  });

  const result = await response.response;
  const extractedData = JSON.parse(
    result
      .text()
      .replace(/```json\n|\n```/g, "")
      .trim()
  );

  // Post-process the extracted data
  return normalizeInvoiceData(extractedData);
}

function normalizeInvoiceData(rawData: any) {
  // Helper function to find keys by common patterns
  const findKeysByPattern = (obj: any, patterns: RegExp[]): string[] => {
    return Object.keys(obj).filter((key) =>
      patterns.some((pattern) => pattern.test(key.toLowerCase()))
    );
  };

  // Helper to extract nested value using patterns
  const extractValue = (obj: any, patterns: RegExp[]): any => {
    const key = findKeysByPattern(obj, patterns)[0];
    return key ? obj[key] : null;
  };

  // Normalize monetary values
  const parseAmount = (value: any): number => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    return parseFloat(String(value).replace(/[^0-9.-]+/g, "")) || 0;
  };

  try {
    // Define common patterns for different fields
    const patterns = {
      invoiceNumber: [/invoice.*no/i, /bill.*no/i, /ref.*no/i],
      date: [/date/i, /issued.*on/i, /invoice.*date/i],
      customerName: [/customer.*name/i, /bill.*to/i, /consignee/i, /buyer/i],
      businessName: [/company.*name/i, /seller/i, /vendor/i, /business.*name/i],
      gst: [/gst/i, /gstin/i, /tax.*id/i],
      total: [/total/i, /grand.*total/i, /net.*amount/i],
      products: [/items/i, /products/i, /services/i, /particulars/i],
    };

    // Extract and normalize the data
    const normalizedData = {
      document_type: extractValue(rawData, [/type/i, /document/i]) || "INVOICE",
      metadata: {
        invoice_number: extractValue(rawData, patterns.invoiceNumber),
        date: extractValue(rawData, patterns.date),
        place_of_supply: extractValue(rawData, [/place.*supply/i, /location/i]),
        reference_number: extractValue(rawData, [/ref/i, /reference/i]),
      },
      parties: {
        customer: {
          name: extractValue(rawData, patterns.customerName),
          contact: extractValue(rawData, [/phone/i, /contact/i, /mobile/i]),
          address: extractValue(rawData, [/address/i, /location/i]),
          gst_number: extractValue(rawData, patterns.gst),
        },
        business: {
          name: extractValue(rawData, patterns.businessName),
          contact: extractValue(rawData, [
            /company.*phone/i,
            /seller.*contact/i,
          ]),
          address: extractValue(rawData, [
            /company.*address/i,
            /seller.*address/i,
          ]),
          gst_number: extractValue(rawData, [/company.*gst/i, /seller.*gst/i]),
        },
      },
      line_items: normalizeLineItems(rawData),
      charges: extractCharges(rawData),
      totals: {
        subtotal: parseAmount(
          extractValue(rawData, [/subtotal/i, /taxable.*amount/i])
        ),
        tax_total: parseAmount(
          extractValue(rawData, [/tax.*total/i, /total.*tax/i])
        ),
        grand_total: parseAmount(extractValue(rawData, patterns.total)),
      },
      tax_details: normalizeTaxDetails(rawData),
    };

    return normalizedData;
  } catch (error) {
    console.error("Error normalizing invoice data:", error);
    throw error;
  }
}

function normalizeLineItems(rawData: any): any[] {
  // Find the array of items in the raw data
  const itemsArray = findItemsArray(rawData);
  if (!itemsArray) return [];

  return itemsArray.map((item: any) => ({
    description: findValue(item, [/description/i, /item/i, /particular/i]),
    quantity: parseFloat(findValue(item, [/qty/i, /quantity/i, /units/i])) || 0,
    rate: parseAmount(findValue(item, [/rate/i, /price/i, /unit.*price/i])),
    amount: parseAmount(findValue(item, [/amount/i, /total/i, /value/i])),
    tax_rate: parseAmount(findValue(item, [/tax.*rate/i, /gst.*rate/i])),
    tax_amount: parseAmount(findValue(item, [/tax.*amount/i, /gst.*amount/i])),
    discount: parseAmount(findValue(item, [/discount/i, /less/i])),
    hsn_code: findValue(item, [/hsn/i, /sac/i]),
  }));
}

function extractCharges(rawData: any): any {
  const chargePatterns = [
    /shipping/i,
    /freight/i,
    /delivery/i,
    /handling/i,
    /processing/i,
    /packaging/i,
    /making.*charges/i,
    /additional.*charges/i,
    /service.*charge/i,
    /debit.*card.*charges/i,
  ];

  const charges: any = {};

  // Search for charges in the raw data
  Object.entries(rawData).forEach(([key, value]: [string, any]) => {
    chargePatterns.forEach((pattern) => {
      if (pattern.test(key)) {
        const chargeName = key.toLowerCase().replace(/[_\s]+/g, "_");
        charges[chargeName] = parseAmount(value);
      }
    });
  });

  return charges;
}

function normalizeTaxDetails(rawData: any): any {
  const taxDetails: any = {};
  const taxPatterns = [
    { key: "cgst", pattern: /cgst/i },
    { key: "sgst", pattern: /sgst/i },
    { key: "igst", pattern: /igst/i },
    { key: "cess", pattern: /cess/i },
  ];

  taxPatterns.forEach(({ key, pattern }) => {
    const amount = findValue(rawData, [new RegExp(`${key}.*amount`, "i")]);
    const rate = findValue(rawData, [
      new RegExp(`${key}.*rate|${key}.*percentage`, "i"),
    ]);

    if (amount || rate) {
      taxDetails[key] = {
        rate: parseAmount(rate),
        amount: parseAmount(amount),
      };
    }
  });

  return taxDetails;
}

// Helper functions
function findValue(obj: any, patterns: RegExp[]): any {
  if (!obj) return null;
  const key = Object.keys(obj).find((k) =>
    patterns.some((pattern) => pattern.test(k))
  );
  return key ? obj[key] : null;
}

function findItemsArray(data: any): any[] | null {
  const itemPatterns = [/items/i, /products/i, /services/i, /line_items/i];

  // Direct array check
  if (Array.isArray(data)) return data;

  // Look for array in first level
  for (const key of Object.keys(data)) {
    if (
      itemPatterns.some((pattern) => pattern.test(key)) &&
      Array.isArray(data[key])
    ) {
      return data[key];
    }
  }

  // Look for any array in the object
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) return value;
  }

  return null;
}
