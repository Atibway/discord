 "crl + Shift + p = reload window"

 const blog = await db.course.findFirst({
         where: {
           isPublished: true,
           userId: params.userId
         },
         include: {
           chapter:{
             where: {
               isPublished: true
             },
             orderBy:{
               position:"asc"
             },
            
             },
       Comment: {
         where: {
           courseId: params.blogId
        }
      }   
        },
    
        
        
      })


      <!-- blog-id -->

      <main className="max-w-7xl mx-auto py-3 sm:px-3 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card className="mb-8 ">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {blog?.title}
              </CardTitle>
              <div className="md:flex md:items-center space-x-4 text-sm text-gray-500">
              <CardHeader>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={blog?.userImage || ""} />
                      <AvatarFallback>{blog?.author?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {blog?.author}
                        </CardTitle>
                      <p className="text-xs text-gray-500"><span> {new Date(blog?.createdAt as Date).toLocaleDateString('en-Us',{
year: "numeric",
month: "long",
day: 'numeric'
                  }
                    
                  )}</span></p>
                    </div>
                  </div>
                </CardHeader>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {blog?.chapter.map((chapter)=> (
                    <>
                    <h1 className="font-bold text-lg">
                        {chapter.title}
                    </h1>
                    <div>
                    </div>
                  <div className=" 
                   ">
                    <Preview
value={chapter.description as string}
      />
{chapter.imageUrl && (
<div className="flex justify-center">
                    <div className="relative aspect-video rounded-md overflow-hidden h-[25rem] w-[25rem]  ">
                        <Image
                        src={chapter?.imageUrl || ""}
                        fill
                        alt="object-cover "
                        />
                      </div>
</div>
)}
                  </div>
                    </>
                ))}
                
                
                {/* Add more content as needed */}
              </div>
            </CardContent>
            <Footer
  url={`https://fcblog-two.vercel.app/blog/${blog?.id}`}
  title="Blog Post"
  text="Check out this amazing blog post!"
/>

          </Card>

<BlogComments
comments={blog?.Comment}
blogId = {blog?.id}
/>
         
        </div>
      </main>