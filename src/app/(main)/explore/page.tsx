import MasonryGrid from "@/components/masonry/MasonryGrid";

async function getWorks() {
  // TODO: Replace with actual API call
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/works`, { cache: 'no-store' })
  // if (!res.ok) throw new Error('Failed to fetch works')
  // return res.json()

  // Mock data for development
  return [
    {
      id: "1",
      title: "暮色之城",
      description: "城市黄昏时刻的光影捕捉",
      imageUrl: "https://picsum.photos/800/600?random=1",
      user: { id: "u1", name: "摄影师小明", avatarUrl: "https://ui-avatars.com/api/?name=摄影师小明&size=150" },
      likeCount: 128,
      commentCount: 24,
      tags: ["摄影", "城市", "黄昏"],
    },
    {
      id: "2",
      title: "极简主义",
      description: "简单线条构成的视觉语言",
      imageUrl: "https://picsum.photos/800/1200?random=2",
      user: { id: "u2", name: "设计师小花", avatarUrl: "https://ui-avatars.com/api/?name=设计师小花&size=150" },
      likeCount: 256,
      commentCount: 42,
      tags: ["设计", "极简", "几何"],
    },
    {
      id: "3",
      title: "山川之间",
      description: "徒步旅行的所见所感",
      imageUrl: "https://picsum.photos/800/800?random=3",
      user: { id: "u3", name: "旅行家大山", avatarUrl: "https://ui-avatars.com/api/?name=旅行家大山&size=150" },
      likeCount: 512,
      commentCount: 89,
      tags: ["旅行", "自然", "山脉"],
    },
    {
      id: "4",
      title: "数字梦境",
      description: "AI生成的艺术作品",
      imageUrl: "https://picsum.photos/800/1000?random=4",
      user: { id: "u4", name: "数字艺术家梦", avatarUrl: "https://ui-avatars.com/api/?name=数字艺术家梦&size=150" },
      likeCount: 1024,
      commentCount: 156,
      tags: ["AI", "数字艺术", "梦幻"],
    },
    {
      id: "5",
      title: "咖啡时光",
      description: "手冲咖啡的精致瞬间",
      imageUrl: "https://picsum.photos/800/700?random=5",
      user: { id: "u5", name: "咖啡师小林", avatarUrl: "https://ui-avatars.com/api/?name=咖啡师小林&size=150" },
      likeCount: 64,
      commentCount: 12,
      tags: ["咖啡", "生活", "静物"],
    },
    {
      id: "6",
      title: "街头故事",
      description: "城市街头的黑白瞬间",
      imageUrl: "https://picsum.photos/800/900?random=6",
      user: { id: "u6", name: "街拍摄影师", avatarUrl: "https://ui-avatars.com/api/?name=街拍摄影师&size=150" },
      likeCount: 320,
      commentCount: 45,
      tags: ["街拍", "黑白", "纪实"],
    },
  ];
}

export default async function ExplorePage() {
  const works = await getWorks();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">发现</h1>
          <p className="text-gray-600 mt-2">探索来自全球创作者的作品</p>
        </header>

        <MasonryGrid works={works} />
      </div>
    </div>
  );
}
