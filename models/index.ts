import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Types ---

export interface IEvent extends Document {
  event_name: string;
  event_category: 'Sports' | 'Arts' | 'Games';
  event_date: Date;
  first_place?: string | null;
  second_place?: string | null;
  third_place?: string | null;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  points_awarded: {
    first: number;
    second: number;
    third: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroup extends Document {
  group_id: string;
  group_name: string;
  group_color: string;
  total_points: number;
  wins_count: number;
}

export interface IAdmin extends Document {
  username: string;
  password?: string;
  email: string;
  createdAt: Date;
}

// --- Schemas ---

const EventSchema = new Schema<IEvent>({
  event_name: { type: String, required: true, trim: true },
  event_category: { type: String, enum: ['Sports', 'Arts', 'Games'], required: true },
  event_date: { type: Date, required: true },
  first_place: { type: String, enum: ['Group 1', 'Group 2', 'Group 3', null], default: null },
  second_place: { type: String, enum: ['Group 1', 'Group 2', 'Group 3', null], default: null },
  third_place: { type: String, enum: ['Group 1', 'Group 2', 'Group 3', null], default: null },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  points_awarded: {
    first: { type: Number, default: 15 },
    second: { type: Number, default: 10 },
    third: { type: Number, default: 5 }
  }
}, { timestamps: true });

// Indexes for common queries
EventSchema.index({ event_date: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ event_category: 1 });

const GroupSchema = new Schema<IGroup>({
  group_id: { type: String, required: true, unique: true },
  group_name: { type: String, required: true },
  group_color: { type: String, default: '#000000' },
  total_points: { type: Number, default: 0 },
  wins_count: { type: Number, default: 0 }
});

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

// --- Models ---
// Prevent overwriting models if they are already compiled (Next.js hot reload issue)

export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
export const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
