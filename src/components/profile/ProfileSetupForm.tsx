import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateStudentProfile, useLanguages } from "@/hooks/useApiQueries";
import { useAuth } from "@/providers/AuthProvider";

interface ProfileSetupFormProps {
  onComplete: () => void;
}

export const ProfileSetupForm = ({ onComplete }: ProfileSetupFormProps) => {
  const [formData, setFormData] = useState({
    language: '',
    current_grade: ''
  });

  const { data: languages, isLoading: languagesLoading } = useLanguages();
  const createProfileMutation = useCreateStudentProfile();
  const { setProfile } = useAuth();

  const gradeOptions = [
    { value: 'GR8', label: 'Grade 8' },
    { value: 'GR9', label: 'Grade 9' },
    { value: 'GR10', label: 'Grade 10' },
    { value: 'GR11', label: 'Grade 11' },
    { value: 'GR12', label: 'Grade 12' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.language || !formData.current_grade) return;

    try {
      const profile = await createProfileMutation.mutateAsync(formData);
      setProfile(profile);
      onComplete();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = createProfileMutation.isPending || languagesLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-large border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">📚</span>
            </div>
            <CardTitle className="text-2xl font-bold">Setup Your Profile</CardTitle>
            <CardDescription>
              Tell us a bit about yourself to personalize your learning experience
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="current_grade">Current Grade</Label>
                <Select
                  value={formData.current_grade}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, current_grade: value }))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isLoading || !formData.language || !formData.current_grade}
              >
                {isLoading ? "Creating Profile..." : "Complete Setup"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};