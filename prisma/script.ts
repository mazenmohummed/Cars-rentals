import {prisma} from '../lib/prisma'

async function main() {
  // Create a new user with a post
  const City = await prisma.city.create({
    data: {
      name: 'Hurghada',
      description:'hurghada is top',
      image:'https://tse4.mm.bing.net/th/id/OIP.lEjlzmcZgp-AkQHYtQcAcgHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3'


      },
    },

)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
