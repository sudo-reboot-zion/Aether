import { Property, Booking } from '../../redux/slices/redux.types';
import { getProperty, getBooking, getPropertyNonce, getBookingNonce } from './read';

export async function getAllProperties(maxLimit = 200): Promise<Property[]> {
    try {
        const nonce = await getPropertyNonce();
        const properties: Property[] = [];
        const batchSize = 3;

        // Strictly fetch only up to the nonce
        const limit = Math.min(nonce, maxLimit);

        for (let i = 0; i < limit; i += batchSize) {
            const batchPromises = [];
            for (let j = 0; j < batchSize && (i + j) < limit; j++) {
                batchPromises.push(getProperty(i + j));
            }

            const batchResults = await Promise.all(batchPromises);

            for (let j = 0; j < batchResults.length; j++) {
                const property = batchResults[j];
                if (property) {
                    properties.push(property);
                }
            }

            if (i + batchSize < limit) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        return properties;
    } catch (error) {
        console.error("Error fetching all properties:", error);
        return [];
    }
}

export async function getAllBookings(maxLimit = 100): Promise<Booking[]> {
    try {
        const nonce = await getBookingNonce();
        const bookings: Booking[] = [];
        const batchSize = 3;

        // Strictly fetch only up to the nonce
        const limit = Math.min(nonce, maxLimit);

        for (let i = 0; i < limit; i += batchSize) {
            const batchPromises = [];
            for (let j = 0; j < batchSize && (i + j) < limit; j++) {
                batchPromises.push(getBooking(i + j));
            }

            const batchResults = await Promise.all(batchPromises);

            for (let j = 0; j < batchResults.length; j++) {
                const booking = batchResults[j];
                if (booking) {
                    bookings.push(booking);
                }
            }

            if (i + batchSize < limit) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        return bookings;
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        return [];
    }
}

export async function getUserBookings(userAddress: string, maxBookings = 100): Promise<Booking[]> {
    try {
        const allBookings = await getAllBookings(maxBookings);
        return allBookings.filter(b => b.guest === userAddress || b.host === userAddress);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
    }
}

export async function getUserProperties(userAddress: string, maxProperties = 100): Promise<Property[]> {
    try {
        const allProperties = await getAllProperties(maxProperties);
        return allProperties.filter(p => p.owner === userAddress);
    } catch (error) {
        console.error("Error fetching user properties:", error);
        return [];
    }
}
