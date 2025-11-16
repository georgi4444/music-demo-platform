"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ArtistInfoInput } from "@/lib/validations/submission";

interface FieldErrorProps {
  error?: { message?: string };
}

function FieldError({ error }: FieldErrorProps) {
  if (!error?.message) return null;
  return <p className="text-sm text-destructive">{error.message}</p>;
}

interface ArtistInformationSectionProps {
  register: UseFormRegister<ArtistInfoInput>;
  errors: FieldErrors<ArtistInfoInput>;
}

export function ArtistInformationSection({
  register,
  errors,
}: ArtistInformationSectionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Artist Information</h2>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} placeholder="Your name" />
            <FieldError error={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="your@email.com"
            />
            <FieldError error={errors.email} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <Label className="text-base">Social Media Links</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-normal">
                Instagram
              </Label>
              <Input
                id="instagram"
                {...register("instagram")}
                placeholder="https://instagram.com/..."
              />
              <FieldError error={errors.instagram} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soundcloud" className="text-sm font-normal">
                SoundCloud
              </Label>
              <Input
                id="soundcloud"
                {...register("soundcloud")}
                placeholder="https://soundcloud.com/..."
              />
              <FieldError error={errors.soundcloud} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotify" className="text-sm font-normal">
                Spotify
              </Label>
              <Input
                id="spotify"
                {...register("spotify")}
                placeholder="https://open.spotify.com/..."
              />
              <FieldError error={errors.spotify} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            {...register("bio")}
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Tell us about yourself and your music..."
            maxLength={1000}
          />
          <FieldError error={errors.bio} />
        </div>
      </div>
    </Card>
  );
}
