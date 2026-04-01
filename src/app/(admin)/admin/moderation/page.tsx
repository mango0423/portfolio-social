import Image from "next/image";
import Link from "next/link";

async function getModerationQueue() {
  // TODO: Replace with actual API call
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation`, { cache: 'no-store' })
  // if (!res.ok) throw new Error('Failed to fetch moderation queue')
  // return res.json()

  // Mock data for development
  return [
    {
      id: "m1",
      work: {
        id: "w1",
        title: "测试作品1",
        imageUrl: "https://picsum.photos/400/300?random=10",
        user: { id: "u1", name: "用户A", image: "https://i.pravatar.cc/150?u=u1" },
        createdAt: "2026-03-30T10:00:00Z",
      },
      reason: "可能被认为有争议的内容",
      reportedCount: 3,
    },
    {
      id: "m2",
      work: {
        id: "w2",
        title: "测试作品2",
        imageUrl: "https://picsum.photos/400/300?random=11",
        user: { id: "u2", name: "用户B", image: "https://i.pravatar.cc/150?u=u2" },
        createdAt: "2026-03-30T09:00:00Z",
      },
      reason: "举报：疑似抄袭",
      reportedCount: 5,
    },
    {
      id: "m3",
      work: {
        id: "w3",
        title: "测试作品3",
        imageUrl: "https://picsum.photos/400/300?random=12",
        user: { id: "u3", name: "用户C", image: "https://i.pravatar.cc/150?u=u3" },
        createdAt: "2026-03-29T15:00:00Z",
      },
      reason: "含有不当文字",
      reportedCount: 2,
    },
  ];
}

async function approveWork(workId: string) {
  "use server";
  // TODO: Replace with actual API call
  // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/${workId}/approve`, { method: 'POST' })
  console.log("Approved work:", workId);
}

async function rejectWork(workId: string) {
  "use server";
  // TODO: Replace with actual API call
  // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/${workId}/reject`, { method: 'POST' })
  console.log("Rejected work:", workId);
}

export default async function ModerationPage() {
  const queue = await getModerationQueue();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              ← 返回
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">内容审核</h1>
          </div>
          <p className="text-gray-600 mt-2">审核用户举报的内容</p>
        </header>

        {queue.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">暂无待审核内容</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-6">
                  <Image
                    src={item.work.imageUrl}
                    alt={item.work.title}
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/works/${item.work.id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {item.work.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <Image
                            src={item.work.user.image || "/default-avatar.png"}
                            alt={item.work.user.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-600">{item.work.user.name}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-400">
                            {new Date(item.work.createdAt).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                          举报 {item.reportedCount} 次
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500">举报原因：</p>
                      <p className="text-gray-700 mt-1">{item.reason}</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <form action={async () => {
                        "use server";
                        await rejectWork(item.work.id);
                      }}>
                        <button
                          type="submit"
                          className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          驳回
                        </button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await approveWork(item.work.id);
                      }}>
                        <button
                          type="submit"
                          className="px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          通过
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
