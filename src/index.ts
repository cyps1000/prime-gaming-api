import { server } from "./server";
import { BootService } from "./services/boot";

BootService.start(server);
