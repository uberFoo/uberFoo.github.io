window.SIDEBAR_ITEMS = {"constant":[["PIPE_BUF","`PIPE_BUF`—The maximum length at which writes to a pipe are atomic."]],"enum":[["SeekFrom","Enumeration of possible methods to seek within an I/O object."]],"fn":[["close","`close(raw_fd)`—Closes a `RawFd` directly."],["dup","`dup(fd)`—Creates a new `OwnedFd` instance that shares the same underlying file description as `fd`."],["dup2","`dup2(fd, new)`—Changes the file description of a file descriptor."],["dup3","`dup3(fd, new, flags)`—Changes the file description of a file descriptor, with flags."],["fcntl_dupfd_cloexec","`fcntl(fd, F_DUPFD_CLOEXEC)`—Creates a new `OwnedFd` instance, with value at least `min`, that has `O_CLOEXEC` set and that shares the same underlying [file description] as `fd`."],["fcntl_getfd","`fcntl(fd, F_GETFD)`—Returns a file descriptor’s flags."],["fcntl_setfd","`fcntl(fd, F_SETFD, flags)`—Sets a file descriptor’s flags."],["ioctl_fioclex","`ioctl(fd, FIOCLEX)`—Set the close-on-exec flag."],["ioctl_fionbio","`ioctl(fd, FIONBIO, &value)`—Enables or disables non-blocking mode."],["ioctl_fionread","`ioctl(fd, FIONREAD)`—Returns the number of bytes ready to be read."],["ioctl_tiocexcl","`ioctl(fd, TIOCEXCL)`—Enables exclusive mode on a terminal."],["ioctl_tiocnxcl","`ioctl(fd, TIOCNXCL)`—Disables exclusive mode on a terminal."],["pipe","`pipe()`—Creates a pipe."],["poll","`poll(self.fds, timeout)`"],["pread","`pread(fd, buf, offset)`—Reads from a file at a given position."],["preadv","`preadv(fd, bufs, offset)`—Reads from a file at a given position into multiple buffers."],["pwrite","`pwrite(fd, bufs)`—Writes to a file at a given position."],["pwritev","`pwritev(fd, bufs, offset)`—Writes to a file at a given position from multiple buffers."],["raw_stderr","`STDERR_FILENO`—Standard error, raw."],["raw_stdin","`STDIN_FILENO`—Standard input, raw."],["raw_stdout","`STDOUT_FILENO`—Standard output, raw."],["read","`read(fd, buf)`—Reads from a stream."],["readv","`readv(fd, bufs)`—Reads from a stream into multiple buffers."],["retry_on_intr","Call `f` until it either succeeds or fails other than [`Errno::INTR`]."],["stderr","`STDERR_FILENO`—Standard error, borrowed."],["stdin","`STDIN_FILENO`—Standard input, borrowed."],["stdout","`STDOUT_FILENO`—Standard output, borrowed."],["take_stderr","`STDERR_FILENO`—Standard error, owned."],["take_stdin","`STDIN_FILENO`—Standard input, owned."],["take_stdout","`STDOUT_FILENO`—Standard output, owned."],["write","`write(fd, buf)`—Writes to a stream."],["writev","`writev(fd, bufs)`—Writes to a stream from multiple buffers."]],"struct":[["DupFlags","`O_*` constants for use with `dup2`."],["Errno","The error type for `rustix` APIs."],["FdFlags","`FD_*` constants for use with `fcntl_getfd` and `fcntl_setfd`."],["IoSlice","A buffer type used with `Write::write_vectored`."],["IoSliceMut","A buffer type used with `Read::read_vectored`."],["PollFd","`struct pollfd`—File descriptor and flags for use with `poll`."],["PollFlags","`POLL*` flags for use with `poll`."]],"type":[["Result","A specialized `Result` type for `rustix` APIs."]]};