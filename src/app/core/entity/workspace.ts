export interface Workspace {
    id: number;
    name: string;
    type: string;
    capacity: number;
    location: string;
    pricePerSeatPerHour: number;
    available: boolean;
    coworkingSpaceId: number;
  }
