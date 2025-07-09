import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateProfile, useLanguages} from "@/hooks/useApiQueries";



export const ProfileSetupForm = () => {
  const [formData, setFormData] = useState({
    language: '',
    current_grade: ''
  });

  const createProfileMutation = useCreateProfile();

  const {data:languages,error} = useLanguages();

  const grades = [
    { code: 'GR9', name: 'Grade 9' },
    { code: 'GR10', name: 'Grade 10' },
    { code: 'GR11', name: 'Grade 11' },
    { code: 'GR12', name: 'Grade 12' },
    { code: 'UG1', name: 'University Year 1' },
    { code: 'UG2', name: 'University Year 2' },
    { code: 'UG3', name: 'University Year 3' },
    { code: 'UG4', name: 'University Year 4' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.language || !formData.current_grade) {
      return;
    }

    try {
      const profile = await createProfileMutation.mutateAsync(formData);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-large border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">📚</span>
            </div>
            <CardTitle className="text-2xl font-bold">
              Set Up Your Profile
            </CardTitle>
            <CardDescription>
              Tell us about your learning preferences
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="grade">Current Grade Level</Label>
                <Select 
                  value={formData.current_grade} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, current_grade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.code} value={grade.code}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardContent>
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={!formData.language || !formData.current_grade || createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? "Setting up..." : "Complete Setup"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};