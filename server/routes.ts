import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { waitlistFormSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for adding to waitlist
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body
      const data = waitlistFormSchema.parse({
        email: req.body.email,
        linkedinUrl: req.body.linkedinUrl || "",
        profession: req.body.profession,
      });

      // Add to waitlist
      const entry = await storage.addToWaitlist({
        email: data.email,
        linkedinUrl: data.linkedinUrl || "",
        profession: data.profession,
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({
        success: true,
        message: "Thank you for joining our waitlist!",
        data: { id: entry.id },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }

      console.error("Error adding to waitlist:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request. Please try again later.",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
