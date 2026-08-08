import { Request, Response } from 'express';
import Event from '../models/Event.js';

// this function is used for fetching all events for the student swipe poster feed for more info refer code-wiki.md line 24
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error });
  }
};

// this function is used for fetching events created by a specific organizer for more info refer code-wiki.md line 26
export const getOrganizerEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizerId } = req.params;
    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch organizer events', error });
  }
};

// this function is used for creating a new opportunity event poster listing for more info refer code-wiki.md line 28
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, organizerId, organizerName, activityGroup, points, date, location, posterUrl, registrationCap } = req.body;
    
    if (!title || !description || !organizerId || !activityGroup || !points || !date || !location) {
      res.status(400).json({ success: false, message: 'All required event fields must be filled' });
      return;
    }

    const defaultPoster = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

    const newEvent = await Event.create({
      title,
      description,
      organizerId,
      organizerName: organizerName || 'Event Organizer',
      activityGroup,
      points: Number(points),
      date: new Date(date),
      location,
      posterUrl: posterUrl || defaultPoster,
      registrationCap: Number(registrationCap) || 100
    });

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create event', error });
  }
};
