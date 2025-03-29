import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface EnhancementOptions {
  tone: 'professional' | 'conversational' | 'enthusiastic';
  focus: 'technical' | 'leadership' | 'creative' | 'balanced';
  length: 'concise' | 'detailed' | 'comprehensive';
  highlightAchievements: boolean;
  emphasizeSkills: boolean;
  includeMetrics: boolean;
}

export const defaultEnhancementOptions: EnhancementOptions = {
  tone: 'professional',
  focus: 'balanced',
  length: 'detailed',
  highlightAchievements: true,
  emphasizeSkills: true,
  includeMetrics: false
};

/**
 * Enhances a section of the LinkedIn profile using OpenAI's GPT model
 */
export async function enhanceProfileContent(
  sectionName: string,
  originalContent: string,
  options: EnhancementOptions = defaultEnhancementOptions
): Promise<string> {
  // Construct detailed prompt based on enhancement options
  const prompt = constructEnhancementPrompt(sectionName, originalContent, options);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert professional content writer specializing in career development and personal branding. Your task is to enhance LinkedIn profile content to make it more compelling, effective, and tailored to the individual's goals while maintaining accuracy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || originalContent;
  } catch (error) {
    console.error("Error enhancing profile content:", error);
    throw new Error("Failed to enhance profile content. Please try again later.");
  }
}

/**
 * Constructs a detailed prompt for the AI based on enhancement options
 */
function constructEnhancementPrompt(
  sectionName: string,
  originalContent: string,
  options: EnhancementOptions
): string {
  // Basic prompt structure
  let prompt = `Please enhance the following ${sectionName} section from a LinkedIn profile.\n\n`;
  prompt += `Original content:\n"${originalContent}"\n\n`;
  
  // Tone guidance
  prompt += `Use a ${options.tone} tone. `;
  
  // Focus area
  switch (options.focus) {
    case 'technical':
      prompt += 'Focus on technical skills, expertise, and concrete implementation details. ';
      break;
    case 'leadership':
      prompt += 'Emphasize leadership qualities, team management, and strategic initiatives. ';
      break;
    case 'creative':
      prompt += 'Highlight creative problem-solving, innovation, and unique approaches. ';
      break;
    case 'balanced':
      prompt += 'Balance technical expertise with soft skills and business impact. ';
      break;
  }
  
  // Content length
  switch (options.length) {
    case 'concise':
      prompt += 'Keep the content brief and to the point. ';
      break;
    case 'detailed':
      prompt += 'Provide a moderate level of detail that balances brevity and completeness. ';
      break;
    case 'comprehensive':
      prompt += 'Offer comprehensive details that showcase depth of expertise. ';
      break;
  }
  
  // Additional preferences
  if (options.highlightAchievements) {
    prompt += 'Highlight specific achievements and results. ';
  }
  
  if (options.emphasizeSkills) {
    prompt += 'Emphasize relevant skills and technologies. ';
  }
  
  if (options.includeMetrics) {
    prompt += 'Include metrics and quantifiable results where appropriate. ';
  }
  
  // Final instructions
  prompt += '\n\nProvide only the enhanced content without explanations or additional commentary. Maintain the first-person perspective if present in the original. Ensure the content remains truthful and accurate to the original information while making it more impactful.';
  
  return prompt;
}

/**
 * Enhances the entire LinkedIn profile using OpenAI's GPT model
 */
export async function enhanceFullProfile(
  profile: Record<string, any>,
  options: EnhancementOptions = defaultEnhancementOptions
): Promise<Record<string, any>> {
  const enhancedProfile = { ...profile };
  
  // Enhance summary/about section
  if (profile.summary) {
    enhancedProfile.summary = await enhanceProfileContent('summary', profile.summary, options);
  }
  
  // Enhance experience entries
  if (profile.experiences && Array.isArray(profile.experiences)) {
    enhancedProfile.experiences = await Promise.all(
      profile.experiences.map(async (exp) => {
        const enhancedDescription = exp.description 
          ? await enhanceProfileContent('experience', exp.description, options)
          : '';
        
        return {
          ...exp,
          description: enhancedDescription
        };
      })
    );
  }
  
  // Enhance skills section with more descriptive content
  if (profile.skills && Array.isArray(profile.skills)) {
    const skillsText = profile.skills.join(', ');
    const enhancedSkillsText = await enhanceProfileContent('skills', skillsText, {
      ...options,
      length: 'concise' // Skills should remain relatively concise
    });
    
    // Parse enhanced skills back into an array
    enhancedProfile.skills = enhancedSkillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }
  
  return enhancedProfile;
}

/**
 * Analyzes a LinkedIn profile to provide personalized content recommendations
 */
export async function generateContentRecommendations(
  profile: string | Record<string, any>
): Promise<Record<string, string[]>> {
  try {
    // Parse the profile if it's a string
    let profileData: Record<string, any>;
    
    if (typeof profile === 'string') {
      try {
        profileData = JSON.parse(profile);
      } catch (parseError) {
        console.error("Error parsing profile data:", parseError);
        throw new Error("Invalid profile data format. Expected valid JSON.");
      }
    } else {
      profileData = profile;
    }
    
    const profileSummary = JSON.stringify({
      summary: profileData.summary || '',
      headline: profileData.headline || '',
      experiences: (profileData.experiences || []).map((e: Record<string, any>) => ({
        title: e.title || '',
        company: e.company || '',
        description: e.description || ''
      })),
      skills: profileData.skills || []
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor and personal branding consultant. Analyze this LinkedIn profile data and provide specific content recommendations to improve each section."
        },
        {
          role: "user",
          content: `Please analyze this LinkedIn profile data and provide specific recommendations to improve and enhance the content for each section. Focus on making the profile more compelling, achievement-oriented, and professionally effective.
          
          Profile data:
          ${profileSummary}
          
          Provide your recommendations in JSON format with the following structure:
          {
            "summary": ["recommendation 1", "recommendation 2"],
            "headline": ["recommendation 1"],
            "experiences": ["recommendation 1", "recommendation 2"],
            "skills": ["recommendation 1", "recommendation 2"],
            "general": ["recommendation 1", "recommendation 2"]
          }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Handle the case where message.content might be null
    const content = response.choices[0].message.content ?? '{}';
    const recommendations = JSON.parse(content);
    return recommendations;
  } catch (error) {
    console.error("Error generating content recommendations:", error);
    throw new Error("Failed to generate content recommendations. Please try again later.");
  }
}