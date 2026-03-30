const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const errors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, errors });
  }
};

const schemas = {
  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(1, 'Password required'),
    }),
  }),

  createService: z.object({
    body: z.object({
      title: z.string().min(1).max(200),
      shortDescription: z.string().min(1).max(500),
      description: z.string().min(1),
      features: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
      technologies: z.array(z.string()).optional(),
      order: z.number().optional(),
    }),
  }),

  createPortfolio: z.object({
    body: z.object({
      title: z.string().min(1).max(200),
      category: z.string().min(1),
      shortDescription: z.string().min(1).max(500),
      description: z.string().min(1),
      client: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      liveUrl: z.string().url().optional().or(z.literal('')),
    }),
  }),

  createJob: z.object({
    body: z.object({
      title: z.string().min(1).max(200),
      department: z.string().min(1),
      location: z.string().min(1),
      type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
      experience: z.string().min(1),
      description: z.string().min(1),
      requirements: z.array(z.string()).optional(),
      responsibilities: z.array(z.string()).optional(),
    }),
  }),

  createApplication: z.object({
    body: z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      phone: z.string().optional(),
      coverLetter: z.string().optional(),
      linkedIn: z.string().optional(),
      portfolio: z.string().optional(),
    }),
  }),

  createLead: z.object({
    body: z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      subject: z.string().min(1).max(200),
      message: z.string().min(1).max(5000),
      phone: z.string().optional(),
      company: z.string().optional(),
      service: z.string().optional(),
      budget: z.string().optional(),
    }),
  }),
};

module.exports = { validate, schemas };
