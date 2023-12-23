import './globals.css'
import AuthProvider from "./context/authProvider";
import { MessageProvider } from "./context/messageContext";
import { Message } from "./components/message";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <MessageProvider>
          <Message />
          <AuthProvider>
            {children}
          </AuthProvider>
        </MessageProvider>
      </body>
    </html>
  );
}

export default RootLayout;