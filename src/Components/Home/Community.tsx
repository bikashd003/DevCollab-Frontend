import { Skeleton } from '@nextui-org/skeleton';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Community = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      quote:
        'DevCollab has completely transformed how I approach coding. The real-time collaboration features are game-changing, and the community support is absolutely incredible!',
      author: 'Sarah Johnson',
      role: 'Senior Full Stack Developer',
      company: 'TechCorp',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Enhanced Testimonials Section */}
      <section className="py-20 lg:py-32 bg-background dark:bg-dark-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground dark:text-dark-foreground mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their careers through collaborative
              coding.
            </p>
          </motion.div>

          {/* Featured Testimonial Carousel */}
          <div className="max-w-4xl mx-auto mb-16">
            <Skeleton isLoaded={isLoaded} className="rounded-2xl">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative"
              >
                <Quote className="w-12 h-12 text-blue-500 mb-6" />
                <blockquote className="text-xl lg:text-2xl text-foreground dark:text-dark-foreground mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].author}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground dark:text-dark-foreground text-lg">
                        {testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-muted-foreground dark:text-gray-400">
                        {testimonials[currentTestimonial].role} at{' '}
                        {testimonials[currentTestimonial].company}
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial
                          ? 'bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </Skeleton>
          </div>

          {/* Grid of Additional Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Skeleton isLoaded={isLoaded} className="rounded-xl h-full">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-foreground dark:text-dark-foreground mb-6 flex-grow leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-semibold text-foreground dark:text-dark-foreground">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </Skeleton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground dark:text-dark-foreground mb-4">
              Trusted by the Developer Community
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50,000+', label: 'Active Developers', icon: '👥' },
              { number: '1M+', label: 'Lines of Code', icon: '💻' },
              { number: '10,000+', label: 'Projects Completed', icon: '🚀' },
              { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Community;
