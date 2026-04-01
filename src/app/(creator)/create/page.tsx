import WorkUploader from "@/components/upload/WorkUploader";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">上传作品</h1>
          <p className="text-gray-600 mt-2">分享你的创作给更多人</p>
        </header>

        <WorkUploader />
      </div>
    </div>
  );
}
