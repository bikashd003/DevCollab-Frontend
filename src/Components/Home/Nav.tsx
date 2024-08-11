import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Switch } from "@nextui-org/react";
import { useTheme } from "../../Context/ThemeProvider";
import { BsSun } from "react-icons/bs";
import { IoMoonSharp } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IoMenu } from "react-icons/io5";

interface NavProps {
  setIsModalOpen: (value: boolean) => void;
}


const Nav = ({ setIsModalOpen }: NavProps) => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MotionLink = motion.a;
  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" }
  };
  return (
    <>

      <Navbar isBordered isBlurred>
        <NavbarBrand>
          <p className="font-bold text-inherit">DevCollab</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">Features</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" color="foreground">Customers</Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">Integrations</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Switch
              defaultSelected
              size="sm"
              color="success"
              startContent={<BsSun />}
              endContent={<IoMoonSharp />}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <MotionLink href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              Sign Up
            </MotionLink>
          </NavbarItem>
          <NavbarItem className="sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none">
              {isMenuOpen ? <MdOutlineClose /> : <IoMenu />}
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.5 }}
            className="fixed top-16 left-0 right-0 bg-background z-50 p-4 shadow-lg sm:hidden"
          >
            <motion.nav className="flex flex-col gap-4">
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#" className="text-foreground pl-2">Features</motion.a>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#" className="text-foreground">Customers</motion.a>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#" className="text-foreground">Integrations</motion.a>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#" className="text-foreground">
                <Button color="primary" variant="flat" fullWidth onClick={() => setIsModalOpen(true)}>Sign Up</Button>
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default Nav;