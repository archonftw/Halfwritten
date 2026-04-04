import SinglePostClient from "@/PrivComponents/SinglePostClient";
import PostComments from "@/PrivComponents/PostComments";
import CreateCommentClient from "@/PrivComponents/CreateCommentClient"

type propType = {
  params:Promise<{
    id:string
  }>
};

export default async  function Page({ params }: propType) {
    const {id} = await params;
  return <div className="flex justify-between w-full">
    <PostComments postId={id} />
    <SinglePostClient postId={id} />
    <CreateCommentClient postId={id} />
  </div>
}