import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const { date, provider_id } = req.body;

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res
        .status(400)
        .json({ error: 'You can only make appointments with providers' });
    }

    if (provider_id === req.userId) {
      return res.status(401).json({
        error: 'It is not possible to schedule an hour with yourself',
      });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: "Can't make an appointment in the past" });
    }

    const isHourTaken = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (isHourTaken) {
      return res
        .status(401)
        .json({ error: 'Another client has already scheduled this hour' });
    }
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
