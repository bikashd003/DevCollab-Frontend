import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {Skeleton} from "@nextui-org/skeleton";
import { useState } from 'react';

const Commutity = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  setTimeout(() => setIsLoaded(true), 2000);
  return (
    <>
      <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-dark-foreground text-foreground">What Our Community Says</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { quote: "DevLearn has transformed the way I approach coding. The community support is incredible!", author: "Sarah J., Full Stack Developer" },
                  { quote: "The pair programming feature helped me overcome my biggest coding challenges.", author: "Mike T., Frontend Engineer" },
                  { quote: "Thanks to DevLearn, I landed my dream job as a software engineer!", author: "Emily R., Recent Graduate" },
                ].map((item, index) => (
                  <Skeleton isLoaded={isLoaded} className="rounded-lg">
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                      <p className="mb-4 dark:text-black italic text-foreground">{`"${item.quote}"`}</p>
                      <p className="font-semibold dark:text-black text-foreground">- {item.author}</p>
                  </div>
                  </Skeleton>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
        <section className="py-20 bg-blue-600 dark:bg-blue-800 text-white text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8">Join thousands of developers learning and growing together.</p>
            <Link to="#" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 animate-bounce inline-block">Sign Up Now</Link>
          </div>
        </section>
    </>
  )
}

export default Commutity