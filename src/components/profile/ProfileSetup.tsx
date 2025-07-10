import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateProfile, useLanguages} from "@/hooks/useApiQueries";
import { useNavigate } from "react-router-dom";



export const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    language: '',
    current_grade: ''
  });
  const navigate = useNavigate();
  const createProfileMutation = useCreateProfile();
  
  // const {data:languages, error} = useLanguages();


const grades = [
  { code: "1", name: "Grade 1" },
  { code: "2", name: "Grade 2" },
  { code: "3", name: "Grade 3" },
  { code: "4", name: "Grade 4" },
  { code: "5", name: "Grade 5" },
  { code: "6", name: "Grade 6" },
  { code: "7", name: "Grade 7" },
  { code: "8", name: "Grade 8" },
  { code: "9", name: "Grade 9" },
  { code: "10", name: "Grade 10" },
  { code: "11", name: "Grade 11" },
  { code: "12", name: "Grade 12" },
];

const languages = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Spanish" },
  { code: "FR", name: "French" },
  { code: "DE", name: "German" },
  { code: "IT", name: "Italian" },
  { code: "PT", name: "Portuguese" },
];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.language || !formData.current_grade) {
      return;
    }
    try {
      const profile = await createProfileMutation.mutateAsync(formData);
      if (profile) {
        // Redirect to dashboard or show success message
        console.log("Profile created successfully:", profile);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error)
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-large border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <img src="/logo.png" alt="khan education logo" />
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