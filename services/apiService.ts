
/**
 * API Service for fetching data from external APIs
 * 
 * This service provides functions to fetch data from external APIs.
 * The API endpoints and authentication details should be configured
 * by the user in the respective functions.
 */

interface ExpiringContract {
  id: string;
  customer_name: string;
  city: string;
  deal_type: string;
  bpd: number;
  end_date: string;
}

interface CustomerAllocation {
  id: string;
  customer: string;
  location: string;
  product: string;
  remaining_amount: number;
  lifting_percentage: number;
  refresh_period: string;
  lifting_number_type: string;
}

/**
 * Fetch expiring contracts from external API
 * 
 * TODO: Configure the API endpoint and authentication
 * Replace the mock data with actual API call
 * 
 * Example implementation:
 * const response = await fetch('YOUR_API_ENDPOINT/expiring-contracts', {
 *   method: 'GET',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer YOUR_API_KEY',
 *   },
 * });
 * const data = await response.json();
 * return data;
 */
export const fetchExpiringContracts = async (): Promise<ExpiringContract[]> => {
  try {
    console.log('API Service: Fetching expiring contracts');
    
    // TODO: Replace this with actual API call
    // const response = await fetch('YOUR_API_ENDPOINT/expiring-contracts', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_API_KEY',
    //   },
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.status}`);
    // }
    // 
    // const data = await response.json();
    // return data;

    // Mock data for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: ExpiringContract[] = [
      {
        id: '1',
        customer_name: 'Ascent Aviation Group, Inc',
        city: 'Tyler, TX',
        deal_type: 'Unbranded Flex',
        bpd: 40581,
        end_date: '12/31/2025',
      },
      {
        id: '2',
        customer_name: 'Associated Energy Group LLC',
        city: 'Tyler, TX',
        deal_type: 'Unbranded Flex',
        bpd: 14568,
        end_date: '12/31/2025',
      },
      {
        id: '3',
        customer_name: 'Avfuel Corporation',
        city: 'Big Spring, TX',
        deal_type: 'Unbranded Contract',
        bpd: 846442,
        end_date: '11/30/2025',
      },
      {
        id: '4',
        customer_name: 'Avfuel Corporation',
        city: 'Tyler, TX',
        deal_type: 'Unbranded Flex',
        bpd: 165578,
        end_date: '12/31/2025',
      },
      {
        id: '5',
        customer_name: 'Avfuel Corporation',
        city: 'Tyler, TX',
        deal_type: 'Unbranded Flex',
        bpd: 68009,
        end_date: '11/30/2025',
      },
      {
        id: '6',
        customer_name: 'Avfuel Corporation',
        city: 'Tyler, TX',
        deal_type: 'Unbranded Spot',
        bpd: 10597,
        end_date: '11/29/2025',
      },
      {
        id: '7',
        customer_name: 'Avfuel Corporation',
        city: 'Wichita Falls, TX',
        deal_type: 'Unbranded Contract',
        bpd: 395,
        end_date: '11/30/2025',
      },
      {
        id: '8',
        customer_name: 'Benchmark Resources Inc',
        city: 'Cape Girardeau, MO',
        deal_type: 'Unbranded Contract',
        bpd: 247324,
        end_date: '11/30/2025',
      },
      {
        id: '9',
        customer_name: 'Benchmark Resources Inc',
        city: 'El Dorado, AR',
        deal_type: 'Unbranded Contract',
        bpd: 1084,
        end_date: '11/30/2025',
      },
      {
        id: '10',
        customer_name: 'Benchmark Resources Inc',
        city: 'Memphis, TN',
        deal_type: 'Unbranded Contract',
        bpd: 10807,
        end_date: '11/30/2025',
      },
      {
        id: '11',
        customer_name: 'Chevron Aviation',
        city: 'Dallas, TX',
        deal_type: 'Branded Contract',
        bpd: 25000,
        end_date: '01/15/2026',
      },
      {
        id: '12',
        customer_name: 'Shell Aviation',
        city: 'Houston, TX',
        deal_type: 'Branded Flex',
        bpd: 35000,
        end_date: '02/28/2026',
      },
      {
        id: '13',
        customer_name: 'BP Aviation',
        city: 'Austin, TX',
        deal_type: 'Unbranded Contract',
        bpd: 18500,
        end_date: '03/15/2026',
      },
      {
        id: '14',
        customer_name: 'ExxonMobil Aviation',
        city: 'San Antonio, TX',
        deal_type: 'Branded Contract',
        bpd: 42000,
        end_date: '04/30/2026',
      },
      {
        id: '15',
        customer_name: 'Total Aviation',
        city: 'Fort Worth, TX',
        deal_type: 'Unbranded Flex',
        bpd: 28000,
        end_date: '05/31/2026',
      },
    ];

    console.log('API Service: Expiring contracts fetched (mock data)', mockData.length);
    return mockData;
  } catch (error) {
    console.log('API Service: Error fetching expiring contracts', error);
    throw error;
  }
};

/**
 * Fetch customer allocations from external API
 * 
 * TODO: Configure the API endpoint and authentication
 * Replace the mock data with actual API call
 * 
 * Example implementation:
 * const response = await fetch('YOUR_API_ENDPOINT/customer-allocations', {
 *   method: 'GET',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer YOUR_API_KEY',
 *   },
 * });
 * const data = await response.json();
 * return data;
 */
export const fetchCustomerAllocations = async (): Promise<CustomerAllocation[]> => {
  try {
    console.log('API Service: Fetching customer allocations');
    
    // TODO: Replace this with actual API call
    // const response = await fetch('YOUR_API_ENDPOINT/customer-allocations', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_API_KEY',
    //   },
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.status}`);
    // }
    // 
    // const data = await response.json();
    // return data;

    // Mock data for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: CustomerAllocation[] = [
      {
        id: '1',
        customer: 'CHEVRON',
        location: 'BIG SPRING TX - DNL',
        product: 'PREMIUM',
        remaining_amount: -200,
        lifting_percentage: 104,
        refresh_period: 'Daily',
        lifting_number_type: 'UNB CONTRACT',
      },
      {
        id: '2',
        customer: 'CHEVRON',
        location: 'BIG SPRING TX - DNL',
        product: 'REGULAR',
        remaining_amount: 1700,
        lifting_percentage: 77,
        refresh_period: 'Daily',
        lifting_number_type: 'UNB CONTRACT',
      },
      {
        id: '3',
        customer: 'FRANKLIN & SON INC',
        location: 'BIG SPRING TX - DNL',
        product: 'REGULAR',
        remaining_amount: 1000,
        lifting_percentage: 80,
        refresh_period: 'Daily',
        lifting_number_type: 'Unbranded Contract',
      },
      {
        id: '4',
        customer: 'KENDRICK',
        location: 'BIG SPRING TX - DNL',
        product: 'PREMIUM',
        remaining_amount: -8001,
        lifting_percentage: 184,
        refresh_period: 'Daily',
        lifting_number_type: 'UNB CONTRACT',
      },
      {
        id: '5',
        customer: 'MUSKET',
        location: 'BIG SPRING TX - DNL',
        product: 'REGULAR',
        remaining_amount: 1900,
        lifting_percentage: 74,
        refresh_period: 'Daily',
        lifting_number_type: 'UNB CONTRACT',
      },
      {
        id: '6',
        customer: 'Thompson Gas LLC',
        location: 'BIG SPRING TX - DNL',
        product: 'REGULAR',
        remaining_amount: -1000,
        lifting_percentage: 114,
        refresh_period: 'Daily',
        lifting_number_type: 'Unbranded Contract',
      },
      {
        id: '7',
        customer: 'BWGC',
        location: 'SAN ANGELO TX - DNL',
        product: 'REGULAR',
        remaining_amount: 5992,
        lifting_percentage: 73,
        refresh_period: 'Daily',
        lifting_number_type: 'Branded Contract',
      },
      {
        id: '8',
        customer: 'Shell Energy',
        location: 'HOUSTON TX - DNL',
        product: 'PREMIUM',
        remaining_amount: 3500,
        lifting_percentage: 65,
        refresh_period: 'Weekly',
        lifting_number_type: 'Branded Contract',
      },
      {
        id: '9',
        customer: 'BP Trading',
        location: 'DALLAS TX - DNL',
        product: 'REGULAR',
        remaining_amount: -500,
        lifting_percentage: 105,
        refresh_period: 'Daily',
        lifting_number_type: 'UNB CONTRACT',
      },
      {
        id: '10',
        customer: 'ExxonMobil',
        location: 'AUSTIN TX - DNL',
        product: 'PREMIUM',
        remaining_amount: 2800,
        lifting_percentage: 82,
        refresh_period: 'Daily',
        lifting_number_type: 'Branded Contract',
      },
      {
        id: '11',
        customer: 'Total Energy',
        location: 'SAN ANTONIO TX - DNL',
        product: 'REGULAR',
        remaining_amount: 4200,
        lifting_percentage: 68,
        refresh_period: 'Weekly',
        lifting_number_type: 'Unbranded Contract',
      },
      {
        id: '12',
        customer: 'Valero',
        location: 'CORPUS CHRISTI TX - DNL',
        product: 'PREMIUM',
        remaining_amount: -1200,
        lifting_percentage: 112,
        refresh_period: 'Daily',
        lifting_number_type: 'UNB CONTRACT',
      },
    ];

    console.log('API Service: Customer allocations fetched (mock data)', mockData.length);
    return mockData;
  } catch (error) {
    console.log('API Service: Error fetching customer allocations', error);
    throw error;
  }
};
