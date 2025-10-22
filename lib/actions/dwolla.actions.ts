"use server";

import { Client } from "dwolla-v2";

const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    const body: any = {
      name: options.fundingSourceName,
      plaidToken: options.plaidToken,
    };
    if (process.env.DWOLLA_REQUIRE_ON_DEMAND === 'true' && options._links) {
      body._links = options._links;
    }

    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, body)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    // dwolla-v2 stores error body in err.body, not err.response.body
    const body = (err as any)?.body || (err as any)?.response?.body;
    
    // If the bank already exists in Dwolla, use the existing funding source URL
    if (body?.code === 'DuplicateResource' && body?._links?.about?.href) {
      console.log('✅ Bank already exists in Dwolla, reusing existing funding source:', body._links.about.href);
      return body._links.about.href;
    }
    
    // Log error for debugging
    console.error("Creating a Funding Source Failed: ", body || err);
    
    // Extract detailed error message
    const detailed = body?._embedded?.errors?.[0]?.message || body?.message;
    const errorMessage = detailed || (err as any)?.message || 'Dwolla funding source creation failed';
    
    // Add helpful context for common errors
    if (errorMessage.includes('invalid. Accepted types: checking, savings, money market')) {
      throw new Error('This account type is not supported. Please select a checking, savings, or money market account (not a credit card or investment account).');
    }
    
    throw new Error(errorMessage);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", (err as any)?.response?.body || err);
    throw new Error((err as any)?.response?.body?._embedded?.errors?.[0]?.message || 'Dwolla on-demand authorization failed');
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    console.log('📝 Dwolla customer data:', JSON.stringify(newCustomer, null, 2));
    return await dwollaClient
      .post("customers", newCustomer)
      .then((res) => res.headers.get("location"));
  } catch (err) {
    // dwolla-v2 stores error body in err.body
    const body = (err as any)?.body || (err as any)?.response?.body;
    
    // Log full Dwolla error response for debugging
    console.error("❌ Creating a Dwolla Customer Failed:");
    console.error("Error body:", JSON.stringify(body, null, 2));
    console.error("Full error:", err);
    
    // Extract detailed error message
    const errorDetails = body?._embedded?.errors || [];
    if (errorDetails.length > 0) {
      const messages = errorDetails.map((e: any) => `${e.path}: ${e.message}`).join(', ');
      throw new Error(`Dwolla customer validation failed: ${messages}`);
    }
    
    throw new Error(body?.message || 'Dwolla customer creation failed');
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };
    
    console.log('💸 Dwolla transfer request:', JSON.stringify(requestBody, null, 2));
    
    return await dwollaClient
      .post("transfers", requestBody)
      .then((res) => {
        const location = res.headers.get("location");
        console.log('✅ Dwolla transfer successful:', location);
        return location;
      });
  } catch (err) {
    // dwolla-v2 stores error in err.body
    const body = (err as any)?.body || (err as any)?.response?.body;
    
    console.error("❌ Dwolla Transfer Failed:");
    console.error("Error body:", JSON.stringify(body, null, 2));
    console.error("Full error:", err);
    
    // Extract detailed error message
    const errorDetails = body?._embedded?.errors || [];
    if (errorDetails.length > 0) {
      const messages = errorDetails.map((e: any) => `${e.path}: ${e.message}`).join(', ');
      throw new Error(`Dwolla transfer validation failed: ${messages}`);
    }
    
    throw new Error(body?.message || (err as any)?.message || 'Dwolla transfer failed');
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("addFundingSource failed: ", err);
    // Re-throw the original error to preserve error details (including DuplicateResource handling)
    throw err;
  }
};
