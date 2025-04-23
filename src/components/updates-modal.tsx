import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Newspaper } from "lucide-react";
import { GithubActivity } from "./github-activity";

export function UpdatesModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Newspaper />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto rounded-sm">
        <DialogHeader>
          <DialogTitle>Updates</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <GithubActivity username="ezzeldinCoder" limit={5} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
