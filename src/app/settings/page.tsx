'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { EmergencyContact, UserSettings } from '@/types';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ threshold: 0.7, modelVersion: 'v1' });
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadContacts = useCallback(async () => {
    if (!user) return;

    try {
      const contactsRef = collection(db, 'users', user.uid, 'contacts');
      const snapshot = await getDocs(contactsRef);
      const contactsData: EmergencyContact[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as EmergencyContact));
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  }, [user]);

  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'preferences');
      const snapshot = await getDoc(settingsRef);
      if (snapshot.exists()) {
        setSettings(snapshot.data() as UserSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadContacts();
    loadSettings();
    setIsLoading(false);
  }, [user, router, loadContacts, loadSettings]);

  const addContact = async () => {
    if (!user || !newContact.name || !newContact.phone || !newContact.email) {
      alert('Please fill in all contact fields');
      return;
    }

    try {
      const contactsRef = collection(db, 'users', user.uid, 'contacts');
      await addDoc(contactsRef, newContact);
      setNewContact({ name: '', phone: '', email: '' });
      loadContacts();
    } catch (error) {
      console.error('Failed to add contact:', error);
      alert('Failed to add contact');
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!user) return;

    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const contactRef = doc(db, 'users', user.uid, 'contacts', contactId);
      await deleteDoc(contactRef);
      loadContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact');
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const settingsRef = doc(db, 'users', user.uid, 'settings', 'preferences');
      await setDoc(settingsRef, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const clearLogs = async () => {
    if (!user) return;

    if (!confirm('Are you sure you want to clear all detection logs?')) return;

    try {
      const logsRef = collection(db, 'users', user.uid, 'logs');
      const snapshot = await getDocs(logsRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      alert('Logs cleared successfully!');
    } catch (error) {
      console.error('Failed to clear logs:', error);
      alert('Failed to clear logs');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your emergency contacts and preferences</p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>
              These contacts will receive SMS and email alerts when a scream is detected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Contacts */}
            {contacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No emergency contacts added yet
              </p>
            ) : (
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Contact */}
            <div className="pt-4 border-t border-border space-y-3">
              <h3 className="font-medium">Add New Contact</h3>
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  />
                </div>
                <Button onClick={addContact}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detection Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Detection Settings</CardTitle>
            <CardDescription>
              Adjust the sensitivity of scream detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">
                Detection Threshold: {(settings.threshold * 100).toFixed(0)}%
              </Label>
              <input
                id="threshold"
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={settings.threshold}
                onChange={(e) => setSettings({ ...settings, threshold: parseFloat(e.target.value) })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Higher threshold = fewer false positives, but may miss some screams
              </p>
            </div>

            <Button onClick={saveSettings} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your detection logs and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
