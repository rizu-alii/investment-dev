import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HomeHeader } from "./components/HomeHeader";
import { HomeFooter } from "./components/HomeFooter";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          description: form.message,
        }),
      });
      const text = await response.text();
      if (response.ok) {
        setFeedback({ type: 'success', message: text || 'Email sent successfully.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setFeedback({ type: 'error', message: text || 'Failed to send email.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-[58rem] text-center">
          <h1 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="mx-auto mt-12 grid gap-8 md:grid-cols-2 lg:max-w-[64rem]">
          <Card>
            <CardContent className="p-6">
              {feedback && (
                <div className={`mb-2 p-2 rounded text-center ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{feedback.message}</div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" value={form.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter subject" value={form.subject} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" className="min-h-[150px]" value={form.message} onChange={handleChange} />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>123 Main Street, New York, NY</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>contact@example.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
                <div className="space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}

export default ContactPage; 