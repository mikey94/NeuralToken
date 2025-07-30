import api from "@/lib/axios";

type NextDayPrediction = {
    next_day_price: number 
}

type NextWeekPrediction = {
    next_7_days: Array<number>
}

export type SummaryYear = {
    Year: number,
    min: number,
    max: number,
    mean: number,
    last: number
}

type SummaryQuarter = {
    Quarter: string,
    min: number,
    max: number,
    mean: number,
    last: number
}

type SummaryMonth = {
    Month: string,
    min: number,
    max: number,
    mean: number,
    last: number
}

export type Summary = {
    yearly: Array<SummaryYear>,
    quarterly: Array<SummaryQuarter>,
    monthly: Array<SummaryMonth>
}

export const getNextDayPrediction = async (coin: string) => {
    try {
        const response = await api.get<NextDayPrediction>(`/predict/next-day/${coin}`);
        return response.data;
    }
    catch (error) {
        console.log('getNextDayPrediction error', error);
        throw error;
    }
};

export const getNextWeekPrediction = async (coin: string) => {
    try {
        const response = await api.get<NextWeekPrediction>(`/predict/next-7-days/${coin}`);
        return response.data;
    }
    catch (error) {
        console.log('getNextWeekPrediction error', error);
        throw error;
    }
};

export const getSummary = async (coin: string, year?: number, month?: number) => {
    try {
        const params = new URLSearchParams();

        if (year !== undefined) {
            params.append('year', year.toString());
        }

        if (month !== undefined) {
            params.append('month', month.toString());
        }
        const query = params.toString();
        const url = query ? `/summary/${coin}?${query}` : `/summary/${coin}`;

        const response = await api.get<Summary>(url)
    
        return response.data;
    }
    catch (error) {
        console.log('getSummary', error);
        throw error;
    }
}

export const getDailyChanges = async (coin: string, year:number, month:number) => {
    try {
        const response = await api.get(`/daily-changes/${coin}/${year}/${month}`);
        return response.data.daily_changes;
    }
    catch (error) {
        console.log('getDailyChanges', error);
        throw error;
    }
}

export const getStartDateOfRecords = async (coin: string) => {
    try {
        const response = await api.get(`/start-date/${coin}`);
        return response.data.start_date;
    }
    catch (error) {
        console.log('getStartDateOfRecords', error);
        throw error;
    }
}

export const getEndDateOfRecords = async (coin: string) => {
    try {
        const response = await api.get(`/end-date/${coin}`);
        return response.data.end_date;
    }
    catch (error) {
        console.log('getEndDateOfRecords', error);
        throw error;
    }
}

