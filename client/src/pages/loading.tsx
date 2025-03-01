import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <motion.p
                    className="text-lg font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    Loading, please wait...
                </motion.p>
            </div>
        </div>
    );
};

export default Loading;
