"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileSettingsProps {
  userId: string;
  currentName: string;
  currentBio: string;
  currentImage: string;
}

export default function ProfileSettings({
  userId,
  currentName,
  currentBio,
  currentImage,
}: ProfileSettingsProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [bio, setBio] = useState(currentBio);
  const [avatar, setAvatar] = useState<string | null>(currentImage);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let imageUrl = avatar;

      // Upload avatar if changed
      if (avatarFile) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: avatar }),
        });

        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      // Update profile
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, image: imageUrl }),
      });

      if (res.ok) {
        alert("保存成功");
        router.refresh();
      } else {
        alert("保存失败");
      }
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">个人设置</h2>

      <div className="space-y-4">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">头像</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="头像"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-400">
                  {name?.[0] || "?"}
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                更换头像
              </span>
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            昵称
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            个人签名
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="介绍一下自己..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}