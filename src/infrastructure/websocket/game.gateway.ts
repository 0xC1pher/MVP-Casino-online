import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards, Inject, Injectable } from "@nestjs/common";
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { BlackjackPlayUseCase } from '../../application/use-cases/blackjack-play.use-case';
import { BingoPlayUseCase } from '../../application/use-cases/bingo-play.use-case';
import { ScratchcardPlayUseCase } from '../../application/use-cases/scratchcard-play.use-case';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
@Injectable()
export class GameGateway {
  constructor(
    @Inject(BlackjackPlayUseCase)
    private blackjackPlayUseCase: BlackjackPlayUseCase,
    @Inject(BingoPlayUseCase)
    private bingoPlayUseCase: BingoPlayUseCase,
    @Inject(ScratchcardPlayUseCase)
    private scratchcardPlayUseCase: ScratchcardPlayUseCase
  ) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("joinGame")
  async handleJoinGame(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket
  ) {
    const room = `game:${data.gameId}`;
    await client.join(room);
    return { event: "joinedGame", data: { gameId: data.gameId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("blackjack:hit")
  async handleBlackjackHit(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.user.id;
    return this.blackjackPlayUseCase.hit(data.gameId, userId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("blackjack:stand")
  async handleBlackjackStand(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.user.id;
    return this.blackjackPlayUseCase.stand(data.gameId, userId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("bingo:checkNumber")
  async handleBingoCheckNumber(
    @MessageBody() data: { gameId: string; number: number },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.user.id;
    return this.bingoPlayUseCase.checkNumber(data.gameId, userId, data.number);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage("scratchcard:reveal")
  async handleScratchcardReveal(
    @MessageBody() data: { gameId: string; position: string },
    @ConnectedSocket() client: Socket
  ) {
    const userId = client.data.user.id;
    return this.scratchcardPlayUseCase.reveal(
      data.gameId,
      userId,
      data.position
    );
  }
}