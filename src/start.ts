/**
 * Start the Express Web-Server
 *
 * created by Sean Maxwell Apr 14, 2019
 */

import Server from './Server';

const appServer = new Server();
appServer.start(4040);
