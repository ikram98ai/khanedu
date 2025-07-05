import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProfileSetupProps {
  onComplete: (profile: any) => void;
}

const grades = [
  { value: "GR1", label: "Grade 1" },
  { value: "GR2", label: "Grade 2" },
  { value: "GR3", label: "Grade 3" },
  { value: "GR4", label: "Grade 4" },
  { value: "GR5", label: "Grade 5" },
  { value: "GR6", label: "Grade 6" },
  { value: "GR7", label: "Grade 7" },
  { value: "GR8", label: "Grade 8" },
  { value: "GR9", label: "Grade 9" },
  { value: "GR10", label: "Grade 10" },
  { value: "GR11", label: "Grade 11" },
  { value: "GR12", label: "Grade 12" },
];

const languages = [
  { value: "EN", label: "English" },
  { value: "ES", label: "Spanish" },
  { value: "FR", label: "French" },
  { value: "DE", label: "German" },
  { value: "IT", label: "Italian" },
  { value: "PT", label: "Portuguese" },
];

export const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const [profile, setProfile] = useState({
    current_grade: '',
    language: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.current_grade || !profile.language) {
      toast({
        title: "Missing Information",
        description: "Please select both grade and language.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for profile creation and auto-enrollment
      setTimeout(() => {
        const mockEnrollments = [
          {
            id: 1,
            name: "Mathematics",
            description: "Learn fundamental mathematical concepts",
            grade_level: profile.current_grade,
            language: profile.language
          },
          {
            id: 2,
            name: "Science",
            description: "Explore the wonders of science",
            grade_level: profile.current_grade,
            language: profile.language
          },
          {
            id: 3,
            name: "Language Arts",
            description: "Master reading, writing, and communication",
            grade_level: profile.current_grade,
            language: profile.language
          }
        ];

        onComplete({
          ...profile,
          enrollments: mockEnrollments
        });
        
        toast({
          title: "Profile Created!",
          description: `You've been automatically enrolled in ${mockEnrollments.length} subjects for ${grades.find(g => g.value === profile.current_grade)?.label}.`,
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-large border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself so we can personalize your learning experience
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="grade">Current Grade</Label>
                <Select
                  value={profile.current_grade}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, current_grade: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg">
                <h4 className="font-medium text-accent-foreground mb-2">What happens next?</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your grade and language preferences, we'll automatically enroll you in the appropriate subjects and courses.
                </p>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Setting up your profile..." : "Complete Setup"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};