export interface Seat {
    id: number;
    seatNumber: string;
    type: string;
    features: string;
    workspaceId: number;
    companyId?: number;
    available: boolean;
  }